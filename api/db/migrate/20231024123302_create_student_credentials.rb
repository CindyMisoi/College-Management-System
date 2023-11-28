class CreateStudentCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :student_credentials do |t|
      t.integer :loginid
      t.string :password_digest

      t.timestamps
    end
  end
end
