# 🚀 AssignIQ — Smart Task Management System

AssignIQ is a modern task management application inspired by tools like Jira.
It helps teams organize, assign, and track tasks efficiently with real-time updates and a clean, intuitive UI.

---

## ✨ Features

* 🧩 Kanban Board (To Do, In Progress, Done)
* ⚡ Drag & Drop task management
* 🧠 Smart task assignment based on team workload
* 📅 Deadline support with alerts
* 🚦 Priority levels (Low, Medium, High)
* 🔍 Search and filter tasks
* 👥 People View (team-wise task distribution)
* 📊 Analytics Dashboard
* 🔄 Real-time updates using Socket.io

---

## 🛠 Tech Stack

### Frontend

* React.js
* @hello-pangea/dnd (Drag & Drop)
* Recharts (Analytics)

### Backend

* Node.js
* Express.js
* PostgreSQL
* Socket.io

---

## 📁 Project Structure

```
assigniq/
├── assigniq-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│
├── assigniq-backend/
│   ├── server.js
│   ├── package.json
```

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the repository

```bash
git clone https://github.com/keerthana-nagireddy/assigniq.git
cd assigniq
```

---

### 2️⃣ Run Backend

```bash
cd assigniq-backend
npm install
node server.js
```

Server runs at:
👉 http://localhost:5000

---

### 3️⃣ Run Frontend

```bash
cd assigniq-frontend
npm install
npm start
```

App runs at:
👉 http://localhost:3000

---

## 🗄 Database Setup (PostgreSQL)

Create a database:

```
assigniq
```

Create the `tasks` table:

```sql
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  title TEXT,
  type TEXT,
  status TEXT,
  assignee TEXT,
  deadline TIMESTAMP,
  priority TEXT
);
```

---

## 🧠 How It Works

* Tasks are created from the frontend
* Backend stores them in PostgreSQL
* Smart assignment logic (`utils/assignTask.js`) assigns tasks to team members
* Socket.io ensures real-time updates across users
* Drag & drop updates task status instantly

---

## 📌 Notes

* Backend runs locally on PostgreSQL
* Frontend communicates with backend via `http://localhost:5000`
* Real-time sync handled using Socket.io
* No authentication system is implemented yet

---

## 🚀 Future Improvements

* 🔐 Authentication (Login/Signup)
* 🌐 Deployment (Frontend + Backend)
* 📱 Mobile responsiveness
* 📊 Advanced analytics
* 🧾 Activity logs

---

## 🙌 Author

Built with ❤️ by **Keerthana**
