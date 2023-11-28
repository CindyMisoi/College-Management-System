require 'securerandom'
class AdminsController < ApplicationController
  skip_before_action :verify_authenticity_token
    def index
        admins = Admin.all
        render json: admins, status: :ok
    end
    def get_details
      begin
        admin = Admin.find_by(employee_id: params[:employee_id]) # Adjust the finding logic as needed
        if admin
          render json: { success: true, message: "Admin Details Found!", admin: admin }
        else
          render json: { success: false, message: "No Admin Found" }, status: :bad_request
        end
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
      end
    end
     # Create action (for registration)
     def register
      admin = Admin.new(admin_params)
      if admin.valid?
        session[:loginid] = admin.id
        session_token = SecureRandom.hex(32)
        admin.save(session_token: session_token)
        render json: {admin: admin, session_token: session_token}, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

     # handles auto login
     def show
      admin = Admin.find_by(id: session[:loginid])
      session_token = request.headers['Authorization']&.split(' ')&.last 
      # Extract the session token from the Authorization header  
      if session_token
        admin = Admin.find_by(session_token: session_token)
            if admin
              render json: admin, status: :ok
              return
            end
      end
      
          render json: { error: 'Unauthorized'}, status: :unauthorized 
      end

    # Create action for adding admin details
  def create
    begin
      # Check if an admin with the given employee_id already exists
      admin = Admin.find_by(employee_id: params[:employee_id])

      if admin
        render json: { success: false, message: "Admin With This EmployeeId Already Exists" }, status: :bad_request
      else
        admin = Admin.create(admin_params)
        render json: { success: true, message: "Admin Details Added!", user: admin }
      end
    rescue StandardError => e
      render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
    end
  end
    
    # update admin details
    def update
      begin
        admin = Admin.find(params[:id]) # Find the admin by ID
        if admin
          if admin.update(admin_params)
            render json: { success: true, message: "Updated Successfully!" }
          else
            render json: { success: false, message: "Update Failed" }, status: :bad_request
          end
        else
          render json: { success: false, message: "No Admin Found" }, status: :bad_request
        end
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
      end
    end
  
    def destroy
      admin = Admin.find(params[:id]) # Find the admin by ID
      admin.destroy
      head :no_content
    end
    def count
      begin
        count = Admin.count # Count the number of student records
        render json: { success: true, message: "Count Successful!", count: count }
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error", error: e }, status: :internal_server_error
      end
    end
  private
  def admin_params
    params.permit(
      :loginid, :password,
      :employee_id, :firstName, :middleName, :lastName,
      :email, :phoneNumber, :gender, :profile
    )
  end
end
