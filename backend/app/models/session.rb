class Session < ApplicationRecord
  belongs_to :user
  
  before_create :generate_token
  
  validates :token, presence: true, uniqueness: true
  
  private
  
  def generate_token
    loop do
      self.token = SecureRandom.urlsafe_base64(32)
      break unless Session.exists?(token: token)
    end
  end
end
