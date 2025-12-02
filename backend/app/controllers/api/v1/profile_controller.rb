module Api
  module V1
    class ProfileController < ApplicationController
      before_action :authenticate_user!

      # GET /v1/profile
      def show
        render json: profile_response
      end

      # PATCH /v1/profile
      def update
        if current_user.update(profile_params)
          render json: profile_response
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def profile_response
        {
          id: current_user.id,
          email: current_user.email,
          birthdate: current_user.birthdate,
          current_age: current_user.current_age,
          timezone: current_user.timezone,
          values_tags: current_user.values_tags,
          provider: current_user.provider
        }
      end

      def profile_params
        params.require(:profile).permit(:birthdate, :timezone, values_tags: {})
      end
    end
  end
end
