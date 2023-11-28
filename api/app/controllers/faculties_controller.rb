class FacultiesController < ApplicationController
        skip_before_action :verify_authenticity_token
          def index
              faculties = Faculty.all
              render json: faculties, status: :ok
          end
          def get_faculty
            begin
              faculty = Faculty.find_by(employee_id: params[:employee_id]) # Adjust the finding logic as needed
              if faculty
                render json: { success: true, message: "Faculty Details Found!", faculty: faculty }
              else
                render json: { success: false, message: "No Faculty Found" }, status: :bad_request
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end
           # Create action (for registration)
           def register
            faculty = Faculty.new(faculty_params)
            if faculty.valid?
              session[:loginid] = faculty.id
              session_token = SecureRandom.hex(32)
              faculty.save(session_token: session_token)
              render json: {faculty: faculty, session_token: session_token}, status: :created
            else
              render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
            end
          end

           # handles auto login
           def show
            faculty = Faculty.find_by(id: session[:loginid])
            session_token = request.headers['Authorization']&.split(' ')&.last 
            # Extract the session token from the Authorization header  
            if session_token
              faculty = Faculty.find_by(session_token: session_token)
                  if faculty
                    render json: faculty, status: :ok
                    return
                  end
            end
            
                render json: { error: 'Unauthorized'}, status: :unauthorized 
            end

          # add Faculty details
          def create
            begin
              faculty = Faculty.find_by(employee_id: params[:employee_id]) # Adjust the finding logic as needed
        
              if faculty
                render json: { success: false, message: "Faculty With This EmployeeId Already Exists" }, status: :bad_request
              else
                faculty = Faculty.create(faculty_params)
                render json: { success: true, message: "Faculty Details Added!", faculty: faculty }
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end
          # update admin details
          def update
            begin
              faculty = Faculty.find(params[:id]) # Find the admin by ID
              if faculty
                if faculty.update(faculty_params)
                  render json: { success: true, message: "Updated Successfully!" }
                else
                  render json: { success: false, message: "Update Failed" }, status: :bad_request
                end
              else
                render json: { success: false, message: "No Faculty Found" }, status: :bad_request
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end
        
          def destroy
            faculty = Faculty.find(params[:id]) # Find the admin by ID
            faculty.destroy
            head :no_content
          end
          def count
            begin
              count = Faculty.count # Count the number of faculty records
              render json: { success: true, message: "Count Successful!", count: count }
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error", error: e }, status: :internal_server_error
            end
          end
        private
        def faculty_params
          params.permit(:loginid, :employee_id, :password, :firstName, :middleName, :lastName, :email, :phoneNumber, :gender, :profile, :department, :experience, :post)
        end
 end
  

