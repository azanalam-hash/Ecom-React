import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = localStorage.getItem("userInfo");
    
    if (storedUserInfo) {
      try {
        // Correctly parse the JSON straight away
        setUser(JSON.parse(storedUserInfo));
      } catch(e) {
        console.error('Error parsing token from storage:', e);
        localStorage.removeItem("userInfo");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  const getAuthHeaders = () => {
    if (user && user.token) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      };
    }
    return { "Content-Type": "application/json" };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAuthHeaders, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
