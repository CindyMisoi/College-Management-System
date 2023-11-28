class RemoveScoreFromMarks < ActiveRecord::Migration[7.0]
  def change
    remove_column :marks, :score, :integer
  end
end
