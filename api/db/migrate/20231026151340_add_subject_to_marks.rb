class AddSubjectToMarks < ActiveRecord::Migration[7.0]
  def change
    add_column :marks, :subject, :string
  end
end
