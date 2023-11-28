class AddEmployeeIdToFaculties < ActiveRecord::Migration[7.0]
  def change
    add_column :faculties, :employee_id, :integer
  end
end
