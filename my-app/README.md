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
- **Database**: Supabase (PostgreSQL with RLS policies enabled)

---

## 🚀 Quick Local Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/pavankumar338/EDU-Manage.git
   cd student-management-system/WEB/my-app
   npm install
   ```

2. **Configure Database**:
   Run the SQL scripts in [database.sql](file:///c:/Users/pavan/OneDrive/Documents/Projects/Student-Mangament-System/WEB/my-app/database.sql) inside your Supabase SQL Editor.

3. **Configure Environment Variables**:
   Create a `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anonymous-key
   ```

4. **Run Application**:
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.
