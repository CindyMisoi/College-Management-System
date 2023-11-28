class CreateAdmins < ActiveRecord::Migration[7.0]
  def change
    create_table :admins do |t|
      t.string :password_digest
      t.string :firstName
      t.string :middleName
      t.string :lastName
      t.string :email
      t.integer :phoneNumber
      t.string :gender
      t.string :profile

      t.timestamps
    end
  end
end
