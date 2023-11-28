class SessionsController < ApplicationController
  # Admin session
  # Login
  def create
    admin = Admin.find_by(loginid: params[:loginid])
    if admin&.authenticate(params[:password])
      session_token = generate_session_token(admin) # Generate session token
      session[:loginid] = admin.id
      admin.update(session_token: session_token) # Save session token for the admin in your database or other secure storage
      render json: admin, status: :ok
    else
      render json: { errors: "Invalid loginid or password" }, status: :unauthorized
    end
  end

  # Admin Logout
  def destroy
    if current_admin
      current_admin.update(session_token: nil) # Clear session token for the admin
      session.delete(:loginid)
      head :no_content
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  # Faculty session
  # Login for faculties
  def create_faculties
    faculty = Faculty.find_by(loginid: params[:loginid])
    if faculty&.authenticate(params[:password])
      session_token = generate_session_token_faculty(faculty) # Generate session token
      session[:loginid] = faculty.id
      faculty.update(session_token: session_token) # Save session token for the faculty in your database or other secure storage
      render json: faculty, status: :ok
    else
      render json: { errors: "Invalid loginid or password" }, status: :unauthorized
    end
  end

  # Logout for faculties
  def destroy_faculties
    if current_faculty
      current_faculty.update(session_token: nil) # Clear session token for the faculty
      session.delete(:loginid)
      head :no_content
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

   # Login for students
   def create_students
    student = Student.find_by(loginid: params[:loginid])
    if student&.authenticate(params[:password])
      session_token = generate_session_token_student(student) # Generate session token
      session[:loginid] = student.id
      student.update(session_token: session_token) # Save session token for the student in your database or other secure storage
      render json: student, status: :ok
    else
      render json: { errors: "Invalid loginid or password" }, status: :unauthorized
    end
  end

  # Logout for students
  def destroy_students
    if current_student
      current_student.update(session_token: nil) # Clear session token for the student
      session.delete(:loginid)
      head :no_content
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  private
  def generate_session_token(admin)
    token = SecureRandom.hex(32)
    "#{admin.id}:#{token}"
  end

  def current_admin
    @current_admin ||= begin
      loginid, session_token = session[:loginid]&.split(':')
      Admin.find_by(id: loginid, session_token: session_token)
    end
  end

  def generate_session_token_faculty(faculty)
    token = SecureRandom.hex(32)
    "#{faculty.id}:#{token}"
  end

  def current_faculty
    @current_faculty ||= begin
      loginid, session_token = session[:loginid]&.split(':')
      Faculty.find_by(id: loginid, session_token: session_token)
    end
  end
  def generate_session_token_student(student)
    token = SecureRandom.hex(32)
    "#{student.id}:#{token}"
  end

  def current_student
    @current_student ||= begin
      loginid, session_token = session[:loginid]&.split(':')
      Student.find_by(id: loginid, session_token: session_token)
    end
  end
end
