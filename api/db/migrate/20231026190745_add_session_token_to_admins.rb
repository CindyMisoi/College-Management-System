class AddSessionTokenToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :session_token, :string
    add_column :admins, :string, :string
  end
end
