import { createBrowserRouter } from 'react-router-dom';
import { createRoot } from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import App from "./App";
import "./index.css";
import Login from './Pages/Login';
import Signup from './Pages/Singup'
import { AuthContextProvider } from './AuthContext';


const route = createBrowserRouter([
  {
    path:'/',
    element:<Login/>

  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/dashboard',
    element:<App/>


  }

])

createRoot(document.getElementById("root")!).render(
      <AuthContextProvider>
        <RouterProvider router={route}/>
    </AuthContextProvider>

);