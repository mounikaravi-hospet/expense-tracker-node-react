// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    axios
      .get("/api/check-auth", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.authenticated) {
          setAuth({
            name: res.data.user.name,
            email: res.data.user.email,
            password: res.data.user.password,
            id: res.data.user.id,
          });
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await axios.post(
      "/api/logout",
      {},
      {
        withCredentials: true,
      }
    );
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
