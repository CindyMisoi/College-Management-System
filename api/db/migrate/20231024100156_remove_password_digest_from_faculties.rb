class RemovePasswordDigestFromFaculties < ActiveRecord::Migration[7.0]
  def change
    remove_column :faculties, :password_digest
  end
end
