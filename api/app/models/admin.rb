class Admin < ApplicationRecord
    has_secure_password
    # validations
    validates :email, presence: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP}
end
