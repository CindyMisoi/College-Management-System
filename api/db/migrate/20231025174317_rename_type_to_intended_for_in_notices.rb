class RenameTypeToIntendedForInNotices < ActiveRecord::Migration[7.0]
  def change
    rename_column :notices, :type, :intended_for
  end
end
