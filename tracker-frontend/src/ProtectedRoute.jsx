// ProtectedRoute.jsx
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    // or show a spinner
    return null;
  }

  return auth
    ? children
    : <Navigate to="/" replace />;
};

export default ProtectedRoute;
