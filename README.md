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

---

## ⚙️ Requirements

Before running this project, make sure you have:

* ✅ Node.js installed
* ✅ PostgreSQL installed
* ✅ Git installed

---

## 🚀 How to Run the Project

### 1️⃣ Clone the repository

```bash
git clone https://github.com/keerthana-nagireddy/assigniq.git
cd assigniq
```

---

## 🗄 Step 2: Setup PostgreSQL Database

1. Open PostgreSQL
2. Create a database named:

```
assigniq
```

3. Create the `tasks` table:

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

4. Open `assigniq-backend/server.js` and update database credentials:

```js
const pool = new Pool({
  user: "your_postgres_user",
  host: "localhost",
  database: "assigniq",
  password: "your_password",
  port: 5432,
});
```

⚠️ Important: Update `user` and `password` based on your system

---

## 🔧 Step 3: Run Backend

```bash
cd assigniq-backend
npm install
node server.js
```

👉 Backend runs at: http://localhost:5000

---

## 🎨 Step 4: Run Frontend

```bash
cd assigniq-frontend
npm install
npm start
```

👉 Frontend runs at: http://localhost:3000

---

## 🧠 How It Works

* Tasks are created from the frontend
* Backend stores them in PostgreSQL
* Tasks are automatically assigned using `assignTask.js`
* Socket.io enables real-time updates
* Drag & drop updates task status instantly

---

## 📌 Important Notes

* Backend must be running before frontend
* PostgreSQL must be running locally
* Frontend connects to backend using `http://localhost:5000`
* If database is not configured correctly, the app will not work

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
