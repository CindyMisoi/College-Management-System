class CreateMaterials < ActiveRecord::Migration[7.0]
  def change
    create_table :materials do |t|
      t.string :faculty
      t.string :subject
      t.string :title
      t.string :link

      t.timestamps
    end
  end
end
