"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  useEffect(() => {
    user && CreateUser();
  }, [user]);

  const CreateUser = async () => {
    const result = await axios.post("/api/user ");
    console.log("User created", result.data);
  };
  return <>{children}</>;
}
