class AddExamTypeToMarks < ActiveRecord::Migration[7.0]
  def change
    add_column :marks, :examType, :string
  end
end
