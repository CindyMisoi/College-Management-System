class NoticesController < ApplicationController
    skip_before_action :verify_authenticity_token
  
    def index
      notices = Notice.all
      render json: { success: true, message: "All Notices Loaded!", notices: notices }
    end
  
    def create
      notice = Notice.new(notice_params)
      if notice.save
        render json: { success: true, message: "Notice Added Successfully", notice: notice }
      else
        render json: { success: false, message: "Error Adding Notice" }, status: :bad_request
      end
    end
  
    def update
        notice = Notice.find(params[:id])
      if notice.update(notice_params)
        render json: { success: true, message: "Notice Updated Successfully", notice: notice }
      else
        render json: { success: false, message: "Error Updating Notice" }, status: :bad_request
      end
    end
  
    def destroy
        notice = Notice.find(params[:id])
      if notice.destroy
        render json: { success: true, message: "Notice Deleted Successfully" }
      else
        render json: { success: false, message: "Error Deleting Notice" }, status: :bad_request
      end
    end
  
    private
  
    def notice_params
      params.permit(:link, :description, :title, :intended_for)
    end
  end
  