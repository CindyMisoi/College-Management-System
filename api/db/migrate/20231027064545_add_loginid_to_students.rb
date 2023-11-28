class AddLoginidToStudents < ActiveRecord::Migration[7.0]
  def change
    add_column :students, :loginid, :integer
  end
end
