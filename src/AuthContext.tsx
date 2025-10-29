import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import supabase from './supabaseClient';

interface Session {
  user?: unknown;
  access_token?: string;
}

interface SignInResult {
  success: boolean;
  data?: {
    session?: Session;
  };
  error?: string;
}

interface AuthContextType {
  session: Session | undefined;
  signInUser: (email: string, password: string) => Promise<SignInResult>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | undefined>(undefined);





  const signInUser = async (email: string, password: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      if (error) {
        console.error('Supabase sign-in error:', error.message);
        return { success: false, error: error.message };
      }
      console.log('Supabase sign-in success:', data);
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Unexpected error during sign-in:', error.message);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(undefined);
      console.log('User signed out successfully.');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signInUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
