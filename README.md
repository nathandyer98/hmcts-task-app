# HMCTS Caseworker Task Management System

A simple web application to help caseworkers efficiently manage their tasks.  
Built with a backend API and a frontend interface for creating, viewing, updating, and deleting tasks.

## ✨ Features

- Create a task with a title, description (optional), status, and due date/time
- View a list of all tasks
- View individual task details
- Update the status of a task
- Delete a task
- User-friendly, responsive frontend interface


## 📋 API Endpoints
Method | Endpoint | Description
POST | /tasks | Create a new task
GET | /tasks/:id | Retrieve a task by ID
GET | /tasks | Retrieve all tasks
PATCH | /tasks/:id/status | Update the status of a task
DELETE | /tasks/:id | Delete a task

📚 Technologies Used
Backend: Node.js, Express.js, 
Frontend: React.js 
Database: MongoDB / Mongoose
Styling: Tailwind CSS / DaisyUI 
