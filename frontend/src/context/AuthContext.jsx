import { createContext, useCallback, useContext, useState } from "react";
import { loginAdmin as loginAdminApi } from "../api/admin";

const KUNCI_AUTH = "batikmatch_auth_v1";
const AuthContext = createContext(null);

function bacaSesi() {
  try {
    const sesi = JSON.parse(localStorage.getItem(KUNCI_AUTH) || "null");
    // Sesi admin tiruan dari versi lama (token "mock-jwt-...") tidak diterima backend: buang.
    if (sesi?.role === "admin" && (!sesi.token || sesi.token.startsWith("mock-"))) {
      localStorage.removeItem(KUNCI_AUTH);
      return null;
    }
    return sesi;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(bacaSesi);

  const simpan = useCallback((sesi) => {
    localStorage.setItem(KUNCI_AUTH, JSON.stringify(sesi));
    setUser(sesi);
    return sesi;
  }, []);

  /** Login admin lewat backend (POST /admin/login). Melempar Error berisi pesan dari server kalau gagal. */
  const loginAdmin = useCallback(
    async ({ username, password }) => {
      const hasil = await loginAdminApi(username, password);
      return simpan({
        email: hasil.username,
        username: hasil.username,
        nama: "Kurator Wastra",
        role: "admin",
        token: hasil.token,
      });
    },
    [simpan]
  );

  /** Login kolektor: hanya personalisasi lokal (favorit, riwayat), tanpa akses ke backend. */
  const login = useCallback(
    ({ email, nama }) =>
      simpan({
        email: email || "kolektor@batikmatch.id",
        nama: nama || "Kolektor Batik",
        role: "user",
        token: null,
      }),
    [simpan]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(KUNCI_AUTH);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "guest",
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin" && Boolean(user?.token),
        login,
        loginAdmin,
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
      loginAdmin: async () => null,
      logout: () => {},
    };
  }
  return ctx;
}