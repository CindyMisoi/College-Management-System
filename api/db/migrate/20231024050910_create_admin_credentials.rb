class CreateAdminCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :admin_credentials do |t|
      t.string :loginid
      t.string :integer
      t.string :password_digest

      t.timestamps
    end
  end
end
