module Api
  module V1
    class LinefoodsController < ApplicationController
      before_action :set_food, only: %i[create]

      def index
        # 仮注文は1店舗に限定される、他店舗の仮注文がないことを確認してcreateしている(Cf.L24)
        line_foods = LineFood.active
        if line_foods.exists?
          render :json {
            line_food_ids: line_food.map { |line_food|line_food.id },
            restaurant: line_foods[0].restaurant,
            # それぞれの仮注文個数を合算
            count: line_foods.sum { |line_food|line_food[:count] },
            amount: line_foods.sum { |line_food|line_food.total_amount }
          }, status: :ok
        else
          render json: {}, status: :no_content
        end
      end

      def create
        # 仮注文作成時に他店舗のactiveな仮注文が存在する,仮注文作成に他店舗の仮注文が生成されないための制御
        if LineFood.active.other_restaurant(@ordered_food.restaurant.id).exists?
          return render json: {
            existing_restaurant: LineFood.other_restaurant(@ordered_food.restaurant.id).first.restaurant.name,
            new_restaurant: Food.find(params[:food_id]).restaurant.name,
          }, status: :not_acceptable
        end

        set_line_food(@ordered_food)

        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      # 店舗間の仮注文の活性・非活性化
      def replace
        # 仮注文時の他店舗の仮注文の非活性化
        LineFood.active.other_restaurant(@ordered_food.restaurant.id).each do |line_food|
          line_food.update_attribute(:active, false)
        end
        # 非活性された店舗の仮注文を活性化する@line_food配置
        set_line_food(@ordered_food)
        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      private

        def set_food
          @ordered_food = Food.find(params[:food_id])
        end

        def set_line_food(ordered_food)
          # 仮注文するフードに既に仮注文が存在する
          if ordered_food.line_food.present?
            @line_food = ordered_food.line_food
            @line_food.attributes = {
              count: ordered_food.line_food.count + params[:count],
              active: true
            }
          # 仮注文するフードに仮注文がない
          else
            @line_food = ordered_food.build_line_food(
              count: params[:count],
              restaurant: ordered_food.restaurant
              active: true
            )
          end
        end
    end
  end
end