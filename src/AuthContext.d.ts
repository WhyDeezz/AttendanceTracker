import { ReactNode } from 'react';
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
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthContextProvider: ({ children }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
