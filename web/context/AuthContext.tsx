"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Helper: Check if JWT is expired
  const isTokenExpired = (token: string) => {
    try {
      // Decode the payload (2nd part of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check against current time (exp is in seconds)
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true; // Treat invalid tokens as expired
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("accessToken");
      const savedRefresh = localStorage.getItem("refreshToken");
      const savedUser = localStorage.getItem("username");

      if (savedToken && savedUser && savedRefresh) {
        if (isTokenExpired(savedToken)) {
          // Token is expired! Try to refresh it.
          try {
            const res = await fetch("http://127.0.0.1:8000/api/accounts/token/refresh/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: savedRefresh }),
            });

            if (res.ok) {
              const data = await res.json();
              // Save new tokens
              login(savedUser, data.access, data.refresh || savedRefresh);
            } else {
              // Refresh failed (e.g., refresh token also expired) -> Logout
              logout();
            }
          } catch (err) {
            console.error("Auto-refresh failed", err);
            logout();
          }
        } else {
          // Token is still valid -> Log them in immediately
          setToken(savedToken);
          setUser(savedUser);
        }
      }
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
    // Only redirect if explicitly logging in via form (not auto-refresh)
    // You might want to handle router.push separately or conditionally here
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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