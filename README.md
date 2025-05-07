# Expense Tracker (Node.js & React)

A full-stack expense tracker application built with **React** for the frontend and **Node.js (Express) + MySQL** for the backend. This app lets you add, view, and manage your expenses in an organized way.

---

## 🔍 Project Overview

- **Frontend**: React app (`tracker-frontend`)
- **Backend**: Node.js + Express server (`tracker-backend`)
- **Database**: MySQL

---

## 📦 Prerequisites

- [Node.js & npm](https://nodejs.org/) (v14+)
- [MySQL](https://www.mysql.com/) server up and running

---

## 🛠️ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/mounikaravi-hospet/expense-tracker-node-react.git
   cd expense-tracker-node-react
   ```

2. **Install dependencies**

   - **Backend**

     ```bash
     cd tracker-backend
     npm install
     ```

   - **Frontend**
     ```bash
     cd ../tracker-frontend
     npm install
     ```

---

## ⚙️ Configuration

The backend expects a `config.js` file in the `tracker-backend` folder (this file is in `.gitignore`). Create it with your own database credentials:

```js
// tracker-backend/config.js
import mysql from "mysql2";

export const PORT = 5555;

export const db = mysql.createConnection({
  host: "localhost", // your MySQL host
  user: "root", // your MySQL user
  password: "YOUR_PASS", // your MySQL password
  database: "YOUR_DB", // name of the database to use
});
```

1. Copy the snippet above into `tracker-backend/config.js`
2. Replace `YOUR_PASS` and `YOUR_DB` with your actual MySQL password and database name.
3. Make sure you create the database in MySQL before running the app

## 🚀 Running the App

1. Start the backend server

   ```bash
    cd tracker-backend
    npm run dev
   ```

   The server will run on http://localhost:5555 by default.

2. Start the frontend
   ```bash
    cd ../tracker-frontend
    npm run dev
   ```
