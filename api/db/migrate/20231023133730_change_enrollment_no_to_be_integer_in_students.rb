class ChangeEnrollmentNoToBeIntegerInStudents < ActiveRecord::Migration[7.0]
  def change
    change_column :students, :enrollment_no , :integer
  end
end
