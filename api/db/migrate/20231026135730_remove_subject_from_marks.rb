class RemoveSubjectFromMarks < ActiveRecord::Migration[7.0]
  def change
    remove_column :marks, :subject, :string
  end
end
