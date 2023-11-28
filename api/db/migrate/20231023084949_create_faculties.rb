class CreateFaculties < ActiveRecord::Migration[7.0]
  def change
    create_table :faculties do |t|
      t.string :password_digest
      t.string :firstName
      t.string :middleName
      t.string :lastName
      t.string :email
      t.integer :phoneNumber
      t.string :gender
      t.string :profile
      t.string :department
      t.integer :experience
      t.string :post

      t.timestamps
    end
  end
end
