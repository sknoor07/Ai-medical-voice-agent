import { userDetails } from "@/app/provider";
import React, { createContext, use, useContext } from "react";

export type AuthContextType = {
  userDetail?: userDetails;
  setUserDetail: React.Dispatch<React.SetStateAction<userDetails | undefined>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
