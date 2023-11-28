class RemovePasswordFromAdmins < ActiveRecord::Migration[7.0]
  def change
    remove_column :admins, :password, :string
  end
end
