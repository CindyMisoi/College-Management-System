# seed data
puts "start seeding..."
# Admin
ADMINS = [
    {
        employee_id: 1,
        loginid: 1,
        password: "admin123",
        email: "admin@example.com",
        firstName: "Cynthia",
        middleName: "Jepkosgei",
        lastName: "Misoi",
        phoneNumber: 726160639,
        gender: "female",
        profile: "Developer"
    }
]
ADMINS.each do |admin|
    Admin.create! admin
end
puts "done seeding..."
