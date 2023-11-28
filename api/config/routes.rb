Rails.application.routes.draw do
  resources :student_credentials
# Admin routes
resources :admins, only: [:index, :destroy, :update]
# post request to get admin details
post '/getAdminDetails', to: 'admins#get_details'
# post request to add admin details
post '/addAdminDetails', to: 'admins#create'
# get count
get '/adminCount', to: 'admins#count'


# faculty routes
resources :faculties, only: [:index, :destroy, :update]
# post request to get faculty details
post '/getFacultyDetails', to: 'faculties#get_faculty'
# post request to add faculty details
post '/addFacultyDetails', to: 'faculties#create'
# get count
get '/facultyCount', to: 'faculties#count'

# student routes
resources :students, only: [:index, :destroy, :update]
# post request to get student details
post '/getStudentDetails', to: 'students#get_student'
# post request to load student details
post '/loadStudentDetails', to: 'students#load_student'
# post request to add student details
post '/addStudentDetails', to: 'students#create'
# get count
get '/studentCount', to: 'students#count'

# branch routes
resources :branches, only: [:index, :destroy]
# post request to create branch
post '/addBranch', to: 'branches#create'
# get rquest to get branch
get '/getBranch/:id', to: 'branches#get_branch'
# branch count
get '/branchCount', to: 'branches#count'

# marks routes
resources :marks, only: [:index, :create, :update, :destroy]
# get student marks
post '/getStudentMarks', to: 'marks#get_student_marks'

# materials routes
resources :materials, only: [:index, :create, :update, :destroy]
# get setudent materials
post '/getSubjectMaterial', to: 'materials#get_subject_materials'

# notice routes
resources :notices, only: [:index, :create, :update, :destroy]

# subjects routes
resources :subjects, only: [:index, :create, :destroy]

# timetable routes
resources :timetables, only: [:index, :create, :update, :destroy]
# get timetable
post '/getStudentTimetable', to: 'timetables#get_timetable'


# Admin Credentials routes
# post request to register as admin
post '/admin_credentials/register', to: 'admins#register'
# get request to check session
get '/admin_credentials/:id', to: 'admins#show'

# sessions
# post request to login in session
post '/admin/login', to: 'sessions#create'

# delete request to logout from session
delete '/admin/logout', to: 'sessions#destroy'


# Faculty Credentials routes
# post request to register as admin
post '/faculty_credentials/register', to: 'faculties#register'
# get request to check session
get '/faculty_credentials/:id', to: 'faculties#show'

# sessions
# post request to login in session
post '/faculty/login', to: 'sessions#create_faculties'

# delete request to logout from session
delete '/faculty/logout', to: 'sessions#destroy_faculties'

# student credentials
# post request to register as admin
post '/student_credentials/register', to: 'students#register'
# get request to check session
get '/student_credentials/:id', to: 'students#show'

# sessions
# post request to login in session
post '/student/login', to: 'sessions#create_students'

# delete request to logout from session
delete '/student/logout', to: 'sessions#destroy_students'

# pdf file path
get 'pdf_files/show', to: 'pdf_files#show'

end
