class RemoveStringFromAdmins < ActiveRecord::Migration[7.0]
  def change
    remove_column :admins, :string, :string
  end
end
