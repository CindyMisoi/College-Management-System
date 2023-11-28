class AddScoreToMarks < ActiveRecord::Migration[7.0]
  def change
    add_column :marks, :score, :integer
  end
end
