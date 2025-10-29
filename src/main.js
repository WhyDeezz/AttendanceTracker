import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import { createRoot } from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import App from "./App";
import "./index.css";
import Login from './Pages/Login';
import Signup from './Pages/Singup';
import { AuthContextProvider } from './AuthContext';
const route = createBrowserRouter([
    {
        path: '/',
        element: _jsx(Login, {})
    },
    {
        path: '/signup',
        element: _jsx(Signup, {})
    },
    {
        path: '/dashboard',
        element: _jsx(App, {})
    }
]);
createRoot(document.getElementById("root")).render(_jsx(AuthContextProvider, { children: _jsx(RouterProvider, { router: route }) }));
