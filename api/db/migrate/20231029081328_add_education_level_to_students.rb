class AddEducationLevelToStudents < ActiveRecord::Migration[7.0]
  def change
    add_column :students, :education_level, :string
  end
end
