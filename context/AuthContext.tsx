"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';

type User = {
  id: string;
  email: string;
  username?: string;
  role?: "employee" | "employer";
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  setUserRole: (role: "employee" | "employer") => void;
  logout: () => Promise<void>;
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  setUserRole: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          // Get user profile data from the profiles table if it exists
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, role, avatar_url')
            .eq('id', session.user.id)
            .single();
          
          // Set user with combined auth and profile data
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profileData?.username,
            role: profileData?.role as "employee" | "employer" | undefined,
            avatarUrl: profileData?.avatar_url,
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, role, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: profileData?.username,
          role: profileData?.role as "employee" | "employer" | undefined,
          avatarUrl: profileData?.avatar_url,
        });
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    
    setIsLoading(false);
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Create the user in Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create a profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              username, 
              email,
              created_at: new Date().toISOString(),
            }
          ]);
        
        if (profileError) throw profileError;
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: "employee" | "employer") => {
    if (user) {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating user role:', error);
        return;
      }
      
      // Update local state
      const updatedUser = { ...user, role };
      setUser(updatedUser);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      resetPassword, 
      updatePassword, 
      setUserRole, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 