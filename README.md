# Project Manager App

This is a full-stack project management web app that I built using the MERN stack.
The goal was to create a simple system where users can create projects, add members, and manage tasks.

## Live Links
Frontend: https://project-manager-app-theta.vercel.app/
Backend: https://project-manager-app-ka5u.onrender.com

## Features
* User registration and login (JWT authentication)
* Create and manage projects
* Add members to projects using email
* View all projects you are part of
* Basic task management
* Real-time updates using Socket.io

## Tech Stack

Frontend:

* React.js
* Axios

Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

Deployment:

* Vercel (Frontend)
* Render (Backend)

## Folder Structure

project-manager-app/

* backend/
* src/
* public/
* README.md

## How to Run Locally

1. Clone the repo

git clone https://github.com/gurleengur887-droid/project-manager-app.git

2. Install backend dependencies

cd backend
npm install

3. Run backend

npm run dev

4. Install frontend dependencies

cd ..
npm install

5. Run frontend

npm start

## Environment Variables

Create a `.env` file inside backend folder:

MONGO_URI=mongodb+srv://project_user:project123@cluster0.cbg78sw.mongodb.net/projectDB
JWT_SECRET=secret123
PORT=5000

## What I Learned

* How to build a full-stack app using MERN
* Handling authentication using JWT
* Working with MongoDB and relationships
* Connecting frontend with backend APIs
* Deploying full-stack apps (Render + Vercel)
* Debugging real-world issues (CORS, deployment errors, etc.)

## Future Improvements

* Better UI (currently basic)
* Add roles and permissions properly
* Notifications
* File uploads
* Improve real-time features
  
## Author

Gurleen Kaur
https://github.com/gurleengur887-droid

## Status

Project is complete and deployed.
