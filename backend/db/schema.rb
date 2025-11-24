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

ActiveRecord::Schema[8.1].define(version: 2025_11_24_233706) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "pg_catalog.plpgsql"

  create_table "notification_preferences", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "digest_time", default: "09:00"
    t.boolean "email_enabled", default: true
    t.jsonb "events", default: {}
    t.string "slack_webhook_url"
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["user_id"], name: "index_notification_preferences_on_user_id", unique: true
  end

  create_table "time_buckets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "end_age", null: false
    t.string "granularity", null: false
    t.string "label", null: false
    t.integer "position", default: 0, null: false
    t.integer "start_age", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["user_id", "position"], name: "index_time_buckets_on_user_id_and_position"
    t.index ["user_id", "start_age", "end_age"], name: "index_time_buckets_on_user_id_and_start_age_and_end_age"
    t.index ["user_id"], name: "index_time_buckets_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "birthdate", null: false
    t.datetime "created_at", null: false
    t.citext "email", null: false
    t.string "provider"
    t.string "timezone", default: "Asia/Tokyo"
    t.string "uid"
    t.datetime "updated_at", null: false
    t.jsonb "values_tags", default: {}
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true, where: "((provider IS NOT NULL) AND (uid IS NOT NULL))"
  end

  add_foreign_key "notification_preferences", "users"
  add_foreign_key "time_buckets", "users"
end
