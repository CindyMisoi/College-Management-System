class CreateFacultyCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :faculty_credentials do |t|
      t.string :password_digest
      t.integer :loginid

      t.timestamps
    end
  end
end
