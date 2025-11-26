class Session < ApplicationRecord
  belongs_to :user
  
  before_validation :generate_token, on: :create
  
  validates :token, presence: true, uniqueness: true
  
  private
  
  def generate_token
    return if token.present?
    
    loop do
      self.token = SecureRandom.urlsafe_base64(32)
      break unless Session.exists?(token: token)
    end
  end
end
