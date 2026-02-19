import React, { createContext, useContext, useMemo } from "react";
import { useMeQuery, type MeQuery } from "@/graphql/generated/schema";

type Role = "admin" | "staff" | "parent";

type AuthUser = NonNullable<MeQuery["me"]>;

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;

  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isParent: boolean;

  refreshMe: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, refetch } = useMeQuery({
    fetchPolicy: "network-only",
  });

  const user = data?.me ?? null;

  const value = useMemo<AuthContextType>(() => {
    const role = (user?.role ?? "") as Role;

    const isAuthenticated = !!user;
    const isAdmin = role === "admin";
    const isStaff = role === "staff";
    const isParent = role === "parent";

    const refreshMe = async () => {
      const res = await refetch();
      return res.data?.me ?? null;
    };

    return {
      user,
      loading,
      isAuthenticated,
      isAdmin,
      isStaff,
      isParent,
      refreshMe,
    };
  }, [user, loading, refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
