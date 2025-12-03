Silahis Publication – Frontend
This is the React-based frontend for the Silahis Publication Member & Task Management System. It displays members, tasks, dashboards, and profile pages while communicating with a backend API.

Project Structure
src/
├── App.jsx      # Main layout, routing, data fetching
├── App.css      # Global styles
├── index.css    # Root styling and resets
├── main.jsx     # React entry point
└── pages/       # Members, Tasks, Dashboard, Profile, About


Features
View and manage members
View and manage tasks
See dashboards and individual profiles
Shared layout with header + sidebar navigation
Fetches data from http://localhost:4000/api/members and /api/tasks

Running the Project
1. Install dependencies
npm install
2. Start the development server
npm run dev
Frontend runs at http://localhost:5173.
Make sure the backend API is running on http://localhost:4000.


Database Overview
The backend uses SQLite (app.db) with two main tables:
members
Stores all member information such as:
* ID number
* Name
* Role (Writer, Photojournalist, Videojournalist, etc.)
* Contact details
* Profile photo (Base64)
tasks
Stores coverage assignments:
* Task title & date
* Writer assigned
* Media person assigned
* Description & status
The frontend does not access the database directly.


How the Frontend Works (React)
* React displays all members and tasks using data from the API.
* useState stores the members/tasks in memory.
* useEffect loads the data when the app starts.
* React Router handles navigation for:
    * /members
    * /tasks
    * /dashboard
    * /profile/:idNumber
    * /about
The frontend updates instantly without reloading the page.



