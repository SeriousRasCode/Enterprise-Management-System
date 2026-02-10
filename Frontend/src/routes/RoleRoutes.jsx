import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
