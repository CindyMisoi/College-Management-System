class RemoveAdminIdFromAdmins < ActiveRecord::Migration[7.0]
  def change
    remove_column :admins, :admin_id, :integer
  end
end
