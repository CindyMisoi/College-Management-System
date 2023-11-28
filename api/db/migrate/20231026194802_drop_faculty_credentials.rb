class DropFacultyCredentials < ActiveRecord::Migration[7.0]
  def change
    drop_table :faculty_credentials
  end
end
