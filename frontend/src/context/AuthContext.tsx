import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { updateCurrentUserProfile } from "../api/moviesApi";
import type { UserProfile } from "../types/auth";

interface AuthContextValue {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  user: UserProfile | null;
}

const defaultUser: UserProfile = {
  avatar: "H",
  email: "harshal@gmail.com",
  name: "Harshal",
  role: "Portfolio Admin",
};

const FAKE_LOGIN_EMAIL = "harshal@gmail.com";
const FAKE_LOGIN_PASSWORD = "harshal123";

const mockLoginRequest = async (email: string, password: string) => {
  await new Promise((resolve) => window.setTimeout(resolve, 800));

  if (email.trim().toLowerCase() !== FAKE_LOGIN_EMAIL || password !== FAKE_LOGIN_PASSWORD) {
    throw new Error("Invalid email or password. Try harshal@gmail.com / harshal123.");
  }

  return {
    ...defaultUser,
    email: FAKE_LOGIN_EMAIL,
    name: "Harshal",
  };
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = window.localStorage.getItem("movie-analytics-user");
    if (!stored) return null;

    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem("movie-analytics-user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("movie-analytics-user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Please enter your email and password.");
    }

    const profile = await mockLoginRequest(email, password);
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("movie-analytics-user");
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    const sanitizedProfile = Object.fromEntries(
      Object.entries(profile).filter(([, value]) => value !== undefined && value !== ""),
    ) as Record<string, string>;

    if (!Object.keys(sanitizedProfile).length) return;

    setUser((current) => (current ? { ...current, ...profile } : current));

    try {
      const savedProfile = await updateCurrentUserProfile(sanitizedProfile);
      setUser((current) => (current ? { ...current, ...savedProfile } : current));
    } catch {
      // Keep the local update and let the UI continue smoothly if the backend is unavailable.
    }
  };

  const updatePassword = async (password: string) => {
    if (!password.trim()) return;

    setUser((current) => (current ? { ...current, password } : current));

    try {
      await updateCurrentUserProfile({ password: password.trim() });
    } catch {
      // Keep the local update and let the UI continue smoothly if the backend is unavailable.
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ login, logout, updatePassword, updateProfile, user }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
