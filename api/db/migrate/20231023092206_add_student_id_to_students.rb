class AddStudentIdToStudents < ActiveRecord::Migration[7.0]
  def change
    add_column :students, :student_id, :integer
  end
end
