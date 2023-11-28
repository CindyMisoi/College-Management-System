# app/controllers/materials_controller.rb
class MaterialsController < ApplicationController
    skip_before_action :verify_authenticity_token
  
    def index
      materials = Material.all
      render json: { success: true, message: "All Materials Loaded!", materials: materials }
    end
  
    def get_subject_materials
      begin
        material = Material.find_by(subject: params[:subject]) # Adjust the finding logic as needed
        if material
          render json: { success: true, message: "Material Found!", material: material }
        else
          render json: { success: false, message: "No Material Found" }, status: :bad_request
        end
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
      end
    end

    def create
      material = Material.new(material_params)
      if material.save
        render json: { success: true, message: "Material Added!", material: material }
      else
        render json: { success: false, message: "Error Adding Material" }, status: :bad_request
      end
    end
  
    def update
      material = Material.find(params[:id])
      if material.update(material_params)
        render json: { success: true, message: "Material Updated!", material: material }
      else
        render json: { success: false, message: "Error Updating Material" }, status: :bad_request
      end
    end
  
    def destroy
      material = Material.find(params[:id])
      if material.destroy
        render json: { success: true, message: "Material Deleted!" }
      else
        render json: { success: false, message: "Error Deleting Material" }, status: :bad_request
      end
    end
  
    private
  
    def material_params
      params.permit(:faculty, :link, :subject, :title, :other_parameters)
    end
  end
  
