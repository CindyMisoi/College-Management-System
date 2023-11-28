class AddFacultyIdToFaculties < ActiveRecord::Migration[7.0]
  def change
    add_column :faculties, :faculty_id, :integer
  end
end
