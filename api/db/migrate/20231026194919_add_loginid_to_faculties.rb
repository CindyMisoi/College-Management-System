class AddLoginidToFaculties < ActiveRecord::Migration[7.0]
  def change
    add_column :faculties, :loginid, :integer
  end
end
