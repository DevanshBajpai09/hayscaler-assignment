# Hayscaler Assignment – Employee Leave Management System

A full-stack web application that allows employees to apply for leave and managers/admins to manage and track leave requests efficiently.

## 🚀 Live Demo

🔗 https://hayscaler-assignment.vercel.app/

---

## 📌 Project Overview

This project is an **Employee Leave Management System** built with a modern full-stack architecture.
It allows employees to submit leave requests and track their leave status while administrators can manage approvals and monitor leave activity.

The application focuses on providing a clean user interface, efficient backend APIs, and proper database management.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Deployment

* Frontend: Vercel
* Backend: Render

---

## ✨ Features

### Authentication

* User registration
* Secure login
* Token-based authentication

### Employee Features

* Apply for leave
* View leave history
* Track leave status
* Dashboard with leave summary

### Admin Features

* View all leave requests
* Approve or reject leave
* Monitor employee leave activity

### Dashboard

* Overview of leave statistics
* User-specific data display

---

## 📂 Project Structure

```
hayscaler-assignment
│
├── client                # Frontend (React + Vite)
│   ├── src
│   ├── components
│   ├── pages
│   └── assets
│
├── backend               # Backend (Node + Express)
│   ├── config
│   │   └── db.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── leave.js
│   │   └── dashboard.js
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/DevanshBajpai09/hayscaler-assignment.git
cd hayscaler-assignment
```

---

### 2️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run backend:

```bash
npm start
```

Backend will run on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

Navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

### Authentication

```

POST /api/auth/login
```

### Leave Management

```
POST /api/leave/request
GET /api/leave/user/:userId
GET /api/leave/all
PATCH /api/leave/:leaveId
DELETE /api/leave/:leaveId
```

### Dashboard

```
GET /api/dashboard/:userId
```

---



## 🔑 Demo Login Credentials

You can use the following demo accounts to test the application.

### 👤 Employee Login
Email: `devansh@test.com`  
Password: `123456`

### 👨‍💼 Manager Login
Email: `manager@test.com`  
Password: `123456`




## 🌍 Deployment

Frontend deployed on **Vercel**
Backend deployed on **Render**

Live Application:

```
https://hayscaler-assignment.vercel.app/
```

---

## 📈 Future Improvements

* Role-based access control
* Email notifications for leave approval
* Advanced analytics dashboard
* Calendar integration for leave tracking
* Improved UI/UX with animations

---

## 👨‍💻 Author

**Devansh Bajpai**

Frontend Developer | Full Stack Developer

GitHub:
https://github.com/DevanshBajpai09

---

## ⭐ Acknowledgements

This project was built as part of the **Hayscaler Assignment** to demonstrate full-stack development skills using modern web technologies.
