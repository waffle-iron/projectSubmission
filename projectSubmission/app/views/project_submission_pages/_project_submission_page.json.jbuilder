json.extract! project_submission_page, :id, :name, :email, :slack, :organization, :description, :skills, :timeframe, :teamSize, :paid, :created_at, :updated_at
json.url project_submission_page_url(project_submission_page, format: :json)