
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {path:"/login", element: <LoginPage/>},
    {path:"/register", element: <RegisterPage/>},
    

    {
        path:"/",
        element: <ProtectedRoute/>,
        children:[
            {path:"/projects/:id", element: <ProjectDetailsPage/>},
            {path:"/projects", element: <ProjectsPage/>},
        ]
    }
])