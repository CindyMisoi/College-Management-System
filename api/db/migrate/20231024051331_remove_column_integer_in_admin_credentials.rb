class RemoveColumnIntegerInAdminCredentials < ActiveRecord::Migration[7.0]
  def change
    remove_column :admin_credentials, :integer
  end
end
