module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  class_methods do
    def skip_authentication(**options)
      skip_before_action :authenticate_user!, **options
    end
  end

  private
  
  def current_user
    @current_user ||= find_user_from_session
  end
  
  def find_user_from_session
    return nil unless session_token = cookies.signed[:session_token]
    
    session = Session.includes(:user).find_by(token: session_token)
    session&.user
  end
  
  def authenticate_user!
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def current_session
    @current_session ||= Session.find_by(token: cookies.signed[:session_token])
  end
  
  helper_method :current_user, :current_session if respond_to?(:helper_method)
end
