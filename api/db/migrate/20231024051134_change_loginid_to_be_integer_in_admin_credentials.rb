class ChangeLoginidToBeIntegerInAdminCredentials < ActiveRecord::Migration[7.0]
  def change
    change_column :admin_credentials, :loginid, :integer
  end
end
