"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "motion/react";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Pen, Save, Shield, CreditCard, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    
    try {
      setIsUpdating(true);
      await user.update({
        username: newUsername,
      });
      toast.success("Username updated successfully");
      setIsEditingUsername(false);
    } catch (error: any) {
      console.error("Error updating username:", error);
      toast.error(error.errors?.[0]?.message || "Failed to update username");
    } finally {
      setIsUpdating(false);
    }
  };

  const startEditing = () => {
    setNewUsername(user.username || "");
    setIsEditingUsername(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identity Card */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-lg">
                        <Image 
                            src={user.imageUrl} 
                            alt="Profile" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 text-white shadow-md cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => clerk.openUserProfile()}>
                         <Pen className="w-4 h-4" />
                    </div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4 w-full">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {user.fullName || "User"}
                        </h2>
                        <p className="text-neutral-500 font-medium">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Username</label>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                             {isEditingUsername ? (
                                <div className="flex items-center gap-2 w-full max-w-xs">
                                    <input 
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter username"
                                    />
                                    <Button 
                                        size="icon" 
                                        onClick={handleUpdateUsername} 
                                        disabled={isUpdating}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => setIsEditingUsername(false)}
                                    >
                                        X
                                    </Button>
                                </div>
                             ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-medium">{user.username || "No username set"}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500" onClick={startEditing}>
                                        <Pen className="w-4 h-4" />
                                    </Button>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Security & Plan Column */}
        <div className="space-y-6">
             {/* Security Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Security</h3>
                </div>
                <p className="text-sm text-neutral-500 mb-6">
                    Manage your password and security questions.
                </p>
                <Button 
                    className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    onClick={() => clerk.openUserProfile()} // Not always supported? userProfile works better
                    // Actually passing 'security' might not work in all clerk versions, defaulting to opening profile.
                    // Correct key might be different, but openUserProfile() usually opens the modal.
                >
                    Change Password
                </Button>
            </motion.div>

            {/* Subscription Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Subscription</h3>
                </div>
                <div className="mb-6">
                    <p className="text-sm text-neutral-500">Current Plan</p>
                    <p className="text-2xl font-bold text-blue-600">Free Plan</p>
                </div>
                <Link href="/dashboard/billing">
                    <Button className="w-full" variant="outline">
                        Manage Subscription
                    </Button>
                </Link>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
