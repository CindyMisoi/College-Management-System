class AddPasswordDigestToFaculties < ActiveRecord::Migration[7.0]
  def change
    add_column :faculties, :password_digest, :string
  end
end
