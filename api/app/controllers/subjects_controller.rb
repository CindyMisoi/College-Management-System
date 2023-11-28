class SubjectsController < ApplicationController
    skip_before_action :verify_authenticity_token

  def index
    subjects = Subject.all
    render json: { success: true, message: "All Subjects Loaded!", subjects: subjects }
  end

  def create
    subject = Subject.new(subject_params)

    if subject.save
      render json: { success: true, message: "Subject Added!", subject: subject }
    else
      render json: { success: false, message: "Error Adding Subject" }, status: :bad_request
    end
  end

  def destroy
    subject = Subject.find(params[:id])
    if subject.destroy
      render json: { success: true, message: "Subject Deleted!" }
    else
      render json: { success: false, message: "Error Deleting Subject" }, status: :bad_request
    end
  end

  private

  def subject_params
    params.permit(:name, :code)
  end
end
