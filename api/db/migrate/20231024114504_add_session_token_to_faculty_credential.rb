class AddSessionTokenToFacultyCredential < ActiveRecord::Migration[7.0]
  def change
    add_column :faculty_credentials, :session_token, :string
  end
end
