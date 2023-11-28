class RemoveFacultyIdFromFaculties < ActiveRecord::Migration[7.0]
  def change
    remove_column :faculties, :faculty_id, :integer
  end
end
