# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_10_29_081328) do
  create_table "admins", force: :cascade do |t|
    t.string "firstName"
    t.string "middleName"
    t.string "lastName"
    t.string "email"
    t.integer "phoneNumber"
    t.string "gender"
    t.string "profile"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "employee_id"
    t.integer "loginid"
    t.string "password_digest"
    t.string "session_token"
  end

  create_table "branches", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "faculties", force: :cascade do |t|
    t.string "firstName"
    t.string "middleName"
    t.string "lastName"
    t.string "email"
    t.integer "phoneNumber"
    t.string "gender"
    t.string "profile"
    t.string "department"
    t.integer "experience"
    t.string "post"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "employee_id"
    t.integer "loginid"
    t.string "password_digest"
    t.string "session_token"
  end

  create_table "marks", force: :cascade do |t|
    t.integer "enrollment_no"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "examType"
    t.integer "score"
    t.string "subject"
  end

  create_table "materials", force: :cascade do |t|
    t.string "faculty"
    t.string "subject"
    t.string "title"
    t.string "link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notices", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "intended_for"
    t.string "link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "students", force: :cascade do |t|
    t.string "firstName"
    t.string "middleName"
    t.string "lastName"
    t.string "email"
    t.integer "phoneNumber"
    t.string "profile"
    t.integer "enrollment_no"
    t.string "branch"
    t.integer "semester"
    t.string "gender"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "loginid"
    t.string "password_digest"
    t.string "session_token"
    t.string "education_level"
  end

  create_table "subjects", force: :cascade do |t|
    t.string "name"
    t.integer "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "timetables", force: :cascade do |t|
    t.string "link"
    t.string "branch"
    t.integer "semester"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
