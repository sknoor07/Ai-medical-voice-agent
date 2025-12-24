"use client";

import { AuthContext } from "@/context/UserDetailsContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

export type userDetails = { name: string; email: string; credits: number };

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userDetail, setUserDetail] = React.useState<userDetails | undefined>();
  const { user } = useUser();
  const CreateUser = async () => {
    const result = await axios.post("/api/user");
    console.log("result", result.data);
    setUserDetail(result.data);
  };

  useEffect(() => {
    if (userDetail) {
      console.log("userDetail updated:", userDetail);
    }
  }, [userDetail]);

  useEffect(() => {
    user && CreateUser();
  }, [user]);

  return (
    <AuthContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </AuthContext.Provider>
  );
}
