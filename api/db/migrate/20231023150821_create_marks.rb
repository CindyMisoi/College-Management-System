class CreateMarks < ActiveRecord::Migration[7.0]
  def change
    create_table :marks do |t|
      t.integer :enrollment_no
      t.string :subject
      t.integer :score

      t.timestamps
    end
  end
end
