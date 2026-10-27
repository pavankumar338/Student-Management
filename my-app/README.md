# 🎓 EduManage - School & Student Management System

EduManage is a modern student administration and dynamic academic analytics platform built to simplify records keeping, track presence rates, and visualize educational statistics.

👉 **Live Production URL**: [https://edu-manage-one-psi.vercel.app/](https://edu-manage-one-psi.vercel.app/)

---

## ✨ Features

- **Student Directory**: Capture student profiles, register numbers, residential types, and places of origin with real-time name/number search.
- **Daily Attendance**: Roster sheet to register Present, Absent, and Late students with instant rate summary updates.
- **Academic Performance**: Record Quarterly, Half-Yearly, and Final scores with automated grade filters.
- **Dynamic Analytics**: High-end visuals including performance score distributions, pass/fail donuts, and daily attendance trends graphs.
- **Persistent Theme Switcher**: Animated sliding pill toggle for seamless Light and Dark mode options.
- **CSV Exporters**: Download visual student and performance spreadsheets with a single click.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS v4, Glassmorphism design tokens
- **Graphs**: Recharts
- **Database**: MongoDB (via Mongoose with cached connection pooling)

---

## 🚀 Quick Local Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/pavankumar338/EDU-Manage.git
   cd student-management-system/WEB/my-app
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` in the project root:
   ```env
   # Local MongoDB:
   MONGODB_URI=mongodb://127.0.0.1:27017/edumanage

   # Or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/edumanage?retryWrites=true&w=majority
   ```

3. **Run Application**:
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

---

## 🐳 Run with Docker Compose

Run all three services (Next.js Application, MongoDB, and Mongo Express UI) with a single command:

```bash
docker compose up --build
```

### Services Included:
| Service | Image / Source | Port | Description |
|---|---|---|---|
| **Next.js App** | `./Dockerfile` (standalone) | `http://localhost:3000` | Full-stack EduManage web app |
| **MongoDB** | `mongo:7.0` | `localhost:27017` | Persistent student database engine |
| **Mongo Express** | `mongo-express:latest` | `http://localhost:8081` | Web administration UI for MongoDB |

To stop the services:
```bash
docker compose down
```
