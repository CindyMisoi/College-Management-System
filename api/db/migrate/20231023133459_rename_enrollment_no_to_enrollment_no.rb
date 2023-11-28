class RenameEnrollmentNoToEnrollmentNo < ActiveRecord::Migration[7.0]
  def change
    rename_column :students, :enrollmentNo, :enrollment_no
  end
end
