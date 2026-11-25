import { createContext, useContext, useState } from "react";

const KUNCI_AUTH = "batikmatch_auth_v1";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KUNCI_AUTH) || "null");
    } catch {
      return null;
    }
  });

  function login({ email, role = "admin", nama }) {
    const sesi = {
      email: email || "kurator@batikmatch.id",
      nama: nama || (role === "admin" ? "Kurator Wastra" : "Kolektor Batik"),
      role,
      token: `mock-jwt-${role}-${Date.now()}`,
    };
    localStorage.setItem(KUNCI_AUTH, JSON.stringify(sesi));
    setUser(sesi);
    return sesi;
  }

  function logout() {
    localStorage.removeItem(KUNCI_AUTH);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "guest",
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      role: "guest",
      isAuthenticated: false,
      isAdmin: false,
      login: () => null,
      logout: () => {},
    };
  }
  return ctx;
}