module Api
  module V1
    class RestaurantsController < ApplicationController
      def index
        restaurants = Restaurant.all

        # json形式で200OKと一緒にデータ返却
        render json: {
          restaurants: restaurants
        }, status: :ok
      end
    end
  end
end