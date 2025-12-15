"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: string | null;
  token: string | null;
  isLoading: boolean; // <--- ADD THIS
  login: (username: string, access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <--- ADD THIS (Default true)
  const router = useRouter();

  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("accessToken");
      const savedRefresh = localStorage.getItem("refreshToken");
      const savedUser = localStorage.getItem("username");

      if (savedToken && savedUser && savedRefresh) {
        if (isTokenExpired(savedToken)) {
          try {
            const res = await fetch("http://127.0.0.1:8000/api/accounts/token/refresh/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: savedRefresh }),
            });

            if (res.ok) {
              const data = await res.json();
              login(savedUser, data.access, data.refresh || savedRefresh);
            } else {
              logout();
            }
          } catch (err) {
            console.error("Auto-refresh failed", err);
            logout();
          }
        } else {
          setToken(savedToken);
          setUser(savedUser);
        }
      }
      setIsLoading(false); // <--- IMPORTANT: We are done checking
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (username: string, access: string, refresh: string) => {
    setToken(access);
    setUser(username);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("username", username);
    // router.push("/"); // Optional
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    router.push("/login");
  };

  return (
    // Pass isLoading to the provider
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}