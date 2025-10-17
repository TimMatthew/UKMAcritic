import { Navigate } from "react-router-dom";

export default function HomeRedirect() {
    const role = localStorage.getItem("role");

    return <Navigate to={role === 'manager' ? '/admin-page' : '/user-page'} replace />;
}