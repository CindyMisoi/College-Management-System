class BranchesController < ApplicationController
    skip_before_action :verify_authenticity_token
    # get all branches
    def index
        begin
        branches = Branch.all
        if branches
         render json: {success: true, message:"All branches Loaded", branches: branches}, status: :ok
        else
         render json: { success: false, message: "No Branches Found" }, status: :bad_request
        end
    rescue StandardError => e
        render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
      end
    end

    # get branch
    def get_branch
      branch = Branch.find(params[:id])
      render json: branch, status: :ok
    end
    # post to create branch
    def create
        begin
          name = params[:name]
          branch = Branch.find_by(name: name) # Find the branch by name
    
          if branch
            render json: { success: false, message: "Already Exists!" }, status: :bad_request
          else
            Branch.create(branch_params)
            render json: { success: true, message: "Branch Added!" }
          end
        rescue StandardError => e
          logger.error(e.message) # Log the error for debugging
          render json: { success: false, message: "Internal Server Error" }, status: :internal_server_error
        end
      end
    def destroy
        branch = Branch.find(params[:id]) # Find the Branch by ID
        branch.destroy
        head :no_content
    end
    def count
      begin
        count = Branch.count # Count the number of branch/ course records
        render json: { success: true, message: "Count Successful!", count: count }
      rescue StandardError => e
        render json: { success: false, message: "Internal Server Error", error: e }, status: :internal_server_error
      end
    end

      private
      def branch_params
        params.permit(:name) # Adjust the permitted parameters as needed
      end
end
