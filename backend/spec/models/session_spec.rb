require 'rails_helper'

RSpec.describe Session, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
  end
  
  describe 'validations' do
    let(:user) { create(:user) }
    
    it 'auto-generates token on creation' do
      session = Session.new(user: user, ip_address: '127.0.0.1', user_agent: 'Test')
      expect(session.token).to be_nil
      session.save!
      expect(session.token).to be_present
    end
    
    it 'validates uniqueness of token' do
      session1 = create(:session, user: user)
      session2 = Session.new(user: user, ip_address: '127.0.0.1', user_agent: 'Test')
      session2.token = session1.token
      expect(session2.valid?).to be false
      expect(session2.errors[:token]).to include("has already been taken")
    end
  end
  
  describe 'token generation' do
    let(:user) { create(:user) }
    
    it 'generates a token before validation' do
      session = Session.new(user: user, ip_address: '127.0.0.1', user_agent: 'Test Agent')
      expect(session.token).to be_nil
      session.valid?
      expect(session.token).to be_present
    end
    
    it 'generates a unique token' do
      session1 = create(:session, user: user)
      session2 = create(:session, user: user)
      expect(session1.token).not_to eq(session2.token)
    end
    
    it 'generates a 32-byte urlsafe base64 token' do
      session = create(:session, user: user)
      # Base64 encoding of 32 bytes produces 43-44 characters (without padding)
      expect(session.token.length).to be >= 43
      expect(session.token).to match(/\A[A-Za-z0-9_-]+\z/)
    end
    
    context 'when token collision occurs' do
      it 'retries until a unique token is generated' do
        existing_session = create(:session, user: user)
        
        # Mock SecureRandom to return the same token first, then a different one
        allow(SecureRandom).to receive(:urlsafe_base64).and_return(
          existing_session.token,
          'unique_token_123'
        )
        
        new_session = create(:session, user: user)
        expect(new_session.token).to eq('unique_token_123')
      end
    end
  end
  
  describe 'attributes' do
    let(:session) { create(:session) }
    
    it 'stores IP address' do
      expect(session.ip_address).to be_present
    end
    
    it 'stores user agent' do
      expect(session.user_agent).to be_present
    end
  end
end
