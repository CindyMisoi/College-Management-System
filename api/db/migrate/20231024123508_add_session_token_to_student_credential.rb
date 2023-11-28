class AddSessionTokenToStudentCredential < ActiveRecord::Migration[7.0]
  def change
    add_column :student_credentials, :session_token, :string
  end
end
