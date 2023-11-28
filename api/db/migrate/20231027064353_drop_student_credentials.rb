class DropStudentCredentials < ActiveRecord::Migration[7.0]
  def change
    drop_table :student_credentials
  end
end
