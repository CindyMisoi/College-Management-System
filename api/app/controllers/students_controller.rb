class StudentsController < ApplicationController
    skip_before_action :verify_authenticity_token
          def index
              students = Student.all
              render json: students, status: :ok
          end
          def get_student
            begin
              student = Student.find_by(enrollment_no: params[:enrollment_no]) # Adjust the finding logic as needed
              if student
                render json: { success: true, message: "Student Details Found!", student: student }
              else
                render json: { success: false, message: "No Student Found" }, status: :bad_request
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end

          # Create action (for registration)
          def register
            student = Student.new(student_params)
            if student.valid?
              session[:loginid] = student.id
              session_token = SecureRandom.hex(32)
              student.save(session_token: session_token)
              render json: {student: student, session_token: session_token}, status: :created
            else
              render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
            end
          end

           # handles auto login
           def show
            student = Student.find_by(id: session[:loginid])
            session_token = request.headers['Authorization']&.split(' ')&.last 
            # Extract the session token from the Authorization header  
            if session_token
              student = Student.find_by(session_token: session_token)
                  if student
                    render json: student, status: :ok
                    return
                  end
            end
            
                render json: { error: 'Unauthorized'}, status: :unauthorized 
            end
    
          def load_student
            begin
              student = Student.find_by(load_student_params) # Adjust the finding logic as needed
              if student
                render json: { success: true, message: "Student Details Found!", student: student }
              else
                render json: { success: false, message: "No Student Found" }, status: :bad_request
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end
          # add Student details
          def create
            begin
              student = Student.find_by(enrollment_no: params[:enrollment_no]) # Adjust the finding logic as needed
        
              if student
                render json: { success: false, message: "Student With This enrollment_no Already Exists" }, status: :bad_request
              else
                student = Student.create(student_params)
                render json: { success: true, message: "Student Details Added!", student: student }
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end
          # update student details
          def update
            begin
              student = Student.find(params[:id]) # Find the student by ID
              if student
                if student.update(student_params)
                  render json: { success: true, message: "Updated Successfully!" }
                else
                  render json: { success: false, message: "Update Failed" }, status: :bad_request
                end
              else
                render json: { success: false, message: "No Student Found" }, status: :bad_request
              end
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
            end
          end
        
          def destroy
            student = Student.find(params[:id]) # Find the student by ID
            student.destroy
            head :no_content
          end
          def count
            begin
              count = Student.count # Count the number of student records
              render json: { success: true, message: "Count Successful!", count: count }
            rescue StandardError => e
              render json: { success: false, message: "Internal Server Error", error: e }, status: :internal_server_error
            end
          end
        private
        def student_params
          params.permit(:loginid, :password, :branch, :email, :enrollment_no, :firstName, :middleName, :lastName, :gender, :phoneNumber, :profile, :semester, :education_level)
        end        
        def load_student_params
          params.permit(:branch, :semester, :enrollment_no)
        end
end
