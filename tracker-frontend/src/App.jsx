import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import NavMenu from "./NavMenu/NavMenu";
import { useState } from "react";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AddTransaction from "./AddTransaction/AddTransaction";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavMenu />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/add-transaction"
            element={
              <ProtectedRoute>
                <AddTransaction/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Outlet />
    </AuthProvider>
  );
}

export default App;
