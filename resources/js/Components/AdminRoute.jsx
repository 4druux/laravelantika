import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/Context/useAuth";
import DotLoader from "./loading/DotLoader";

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <DotLoader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Navigate to="/login" replace />
                <DotLoader />
            </div>
        );
    }

    if (user.role !== "admin") {
        return (
            <div className="flex justify-center items-center h-screen">
                <Navigate to="/" replace /> <DotLoader />
            </div>
        );
    }

    return <Outlet />;
};

export default AdminRoute;
