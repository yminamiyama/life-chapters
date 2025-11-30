require 'swagger_helper'

RSpec.describe 'api/v1/dashboard', type: :request do
  path '/api/v1/dashboard/summary' do
    get('Get dashboard summary') do
      tags 'Dashboard'
      description 'Retrieves dashboard summary statistics including bucket counts and item progress'
      produces 'application/json'
      security [{ cookie_auth: [] }]

      response(200, 'successful') do
        schema type: :object,
          properties: {
            total_buckets: { type: :integer, example: 16 },
            total_items: { type: :integer, example: 42 },
            completed_items: { type: :integer, example: 8 },
            active_items: { type: :integer, example: 30 },
            archived_items: { type: :integer, example: 4 }
          },
          required: ['total_buckets', 'total_items', 'completed_items', 'active_items', 'archived_items']
        
        let(:user) { create(:user) }
        
        before do
          sign_in(user)
          bucket = create(:time_bucket, user: user)
          create(:bucket_item, time_bucket: bucket, status: 'active')
          create(:bucket_item, time_bucket: bucket, status: 'completed')
        end
        
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['total_buckets']).to eq(1)
          expect(data['total_items']).to eq(2)
          expect(data['completed_items']).to eq(1)
          expect(data['active_items']).to eq(1)
        end
      end

      response(401, 'unauthorized') do
        schema '$ref' => '#/components/schemas/Error'
        
        run_test!
      end
    end
  end

  path '/api/v1/dashboard/actions-now' do
    get('Get actions for current time bucket') do
      tags 'Dashboard'
      description 'Retrieves bucket items that should be actioned now based on user current age'
      produces 'application/json'
      security [{ cookie_auth: [] }]

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/BucketItem' }
        
        let(:user) { create(:user, birthdate: 30.years.ago) }
        
        before do
          sign_in(user)
          bucket = create(:time_bucket, user: user, start_age: 25, end_age: 35)
          create_list(:bucket_item, 3, time_bucket: bucket, status: 'active')
        end
        
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
          expect(data.length).to eq(3)
        end
      end

      response(401, 'unauthorized') do
        schema '$ref' => '#/components/schemas/Error'
        
        run_test!
      end
    end
  end

  path '/api/v1/dashboard/review-completed' do
    get('Get recently completed items for review') do
      tags 'Dashboard'
      description 'Retrieves recently completed bucket items for review'
      produces 'application/json'
      security [{ cookie_auth: [] }]

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/BucketItem' }
        
        let(:user) { create(:user) }
        
        before do
          sign_in(user)
          bucket = create(:time_bucket, user: user)
          create_list(:bucket_item, 5, time_bucket: bucket, status: 'completed', completed_at: 1.day.ago)
        end
        
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
          expect(data.all? { |item| item['status'] == 'completed' }).to be true
        end
      end

      response(401, 'unauthorized') do
        schema '$ref' => '#/components/schemas/Error'
        
        run_test!
      end
    end
  end
end
