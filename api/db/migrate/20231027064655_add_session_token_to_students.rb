class AddSessionTokenToStudents < ActiveRecord::Migration[7.0]
  def change
    add_column :students, :session_token, :string
  end
end
