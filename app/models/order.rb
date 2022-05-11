class Order < ApplicationRecord
  has_many :line_foods

  validates :total_price, numericality: { greater_than: 0 }

  def save_with_update_line_foods!(line_foods)
    ActiveRecord::Base.transaction do
      line_foods.each do |line_food|
        # orderに紐付くline_foodsのactiveを変えて反映
        line_food.update!(active: false, order: self)
      end
      self.save!
    end
  end
end