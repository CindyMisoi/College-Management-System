class CreateNotices < ActiveRecord::Migration[7.0]
  def change
    create_table :notices do |t|
      t.string :title
      t.string :description
      t.string :type
      t.string :link

      t.timestamps
    end
  end
end
