class AddEmployeeIdToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :employee_id, :integer
  end
end
