class AddSessionTokenToFaculties < ActiveRecord::Migration[7.0]
  def change
    add_column :faculties, :session_token, :string
  end
end
