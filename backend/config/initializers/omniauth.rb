Rails.application.config.middleware.use OmniAuth::Builder do
  if ENV['GOOGLE_OAUTH_CLIENT_ID'].present? && ENV['GOOGLE_OAUTH_CLIENT_SECRET'].present?
    provider :google_oauth2,
             ENV['GOOGLE_OAUTH_CLIENT_ID'],
             ENV['GOOGLE_OAUTH_CLIENT_SECRET'],
             {
               scope: 'email,profile',
               prompt: 'select_account',
               image_aspect_ratio: 'square',
               image_size: 50
             }
  end
end

# Configure OmniAuth to use POST for security
OmniAuth.config.allowed_request_methods = [:post]
