import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
import supabase from './supabaseClient';
const AuthContext = createContext(undefined);
export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);
    const signInUser = async (email, password) => {
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
        }
        catch (error) {
            console.error('Unexpected error during sign-in:', error.message);
            return { success: false, error: 'An unexpected error occurred. Please try again.' };
        }
    };
    const signOutUser = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error)
                throw error;
            setSession(undefined);
            console.log('User signed out successfully.');
        }
        catch (error) {
            console.error('Error signing out:', error.message);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { session, signInUser, signOutUser }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};
