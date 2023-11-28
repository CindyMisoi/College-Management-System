class AddAdminIdToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :admin_id, :integer
  end
end
