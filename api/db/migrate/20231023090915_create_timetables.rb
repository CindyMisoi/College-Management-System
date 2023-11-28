class CreateTimetables < ActiveRecord::Migration[7.0]
  def change
    create_table :timetables do |t|
      t.string :link
      t.string :branch
      t.integer :semester

      t.timestamps
    end
  end
end
