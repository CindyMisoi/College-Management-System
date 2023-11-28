class AddLoginidToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :loginid, :integer
  end
end
