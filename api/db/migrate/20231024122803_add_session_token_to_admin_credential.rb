class AddSessionTokenToAdminCredential < ActiveRecord::Migration[7.0]
  def change
    add_column :admin_credentials, :session_token, :string
  end
end
