# app/controllers/timetables_controller.rb
class TimetablesController < ApplicationController
    skip_before_action :verify_authenticity_token
  
    def index
      timetables = Timetable.all
      render json: { success: true, message: "All Timetables Loaded!", timetables: timetables }
    end
  
    def get_timetable
      begin
        timetable = Timetable.find_by(get_timetable_params) # Adjust the finding logic as needed
        if timetable
          render json: { success: true, message: "Timetable Found!", timetable: timetable }
        else
          render json: { success: false, message: "No Timetable Found" }, status: :bad_request
        end
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
      end
    end
    def create
      timetable = Timetable.new(timetable_params)
  
      if timetable.save
        render json: { success: true, message: "Timetable Added!", timetable: timetable }
      else
        render json: { success: false, message: "Error Adding Timetable" }, status: :bad_request
      end
    end
  
    def update
      timetable = Timetable.find(params[:id])
      if timetable.update(timetable_params)
        render json: { success: true, message: "Timetable Updated!", timetable: timetable }
      else
        render json: { success: false, message: "Error Updating Timetable" }, status: :bad_request
      end
    end
  
    def destroy
      timetable = Timetable.find(params[:id])
      if timetable.destroy
        render json: { success: true, message: "Timetable Deleted!" }
      else
        render json: { success: false, message: "Error Deleting Timetable" }, status: :bad_request
      end
    end
  
    private
  
    def timetable_params
      params.permit(:link, :semester, :branch)
    end
    def get_timetable_params
      params.permit(:semester, :branch)
    end
  end
  
