class CreateStudents < ActiveRecord::Migration[7.0]
  def change
    create_table :students do |t|
      t.string :password_digest
      t.string :firstName
      t.string :middleName
      t.string :lastName
      t.string :email
      t.integer :phoneNumber
      t.string :profile
      t.integer :enrollmentNo
      t.string :branch
      t.integer :semester
      t.string :gender

      t.timestamps
    end
  end
end
