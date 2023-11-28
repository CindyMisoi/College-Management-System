class DropAdminCredentials < ActiveRecord::Migration[7.0]
  def change
    drop_table :admin_credentials
  end
end
