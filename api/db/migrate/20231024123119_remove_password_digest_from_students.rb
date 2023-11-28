class RemovePasswordDigestFromStudents < ActiveRecord::Migration[7.0]
  def change
    remove_column :students, :password_digest, :string
  end
end
