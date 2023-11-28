class MarksController < ApplicationController
    skip_before_action :verify_authenticity_token
  
    def index
      marks = Mark.all
      render json: { success: true, message: "All Marks Loaded!", marks: marks }
    end
  
    def get_student_marks
      begin
        student = Student.find_by(enrollment_no: params[:enrollment_no])
        if student
          marks = Mark.where(enrollment_no: student.enrollment_no)
          if marks.any?
            render json: { success: true, message: "Student Marks Loaded!", marks: marks }, status: :ok
          else
            render json: { success: false, message: "No Marks Found for the Student" }, status: :not_found
          end
        else
          render json: { success: false, message: "No Student Found" }, status: :not_found
        end
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
      end
    end
    
    def create
      mark = Mark.new(mark_params)
      if mark.save
        render json: { success: true, message: "Marks Added!", mark: mark }
      else
        render json: { success: false, message: "Error Adding Marks" }, status: :bad_request
      end
    end
  
    def update
      mark = Mark.find(params[:id])
      if mark.update(mark_params)
        render json: { success: true, message: "Marks Updated!", mark: @mark }
      else
        render json: { success: false, message: "Error Updating Marks" }, status: :bad_request
      end
    end
  
    def destroy
      mark = Mark.find(params[:id])
      if mark.destroy
        render json: { success: true, message: "Marks Deleted!" }
      else
        render json: { success: false, message: "Error Deleting Marks" }, status: :bad_request
      end
    end
  
    private
  
    def mark_params
      params.permit(:enrollment_no, :examType, :subject, :score)
    end
  end
  