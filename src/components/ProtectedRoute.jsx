import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AuthContext from "../context/AuthContext"; // adjust path if your AuthContext lives elsewhere

// Where each role lands after login or when opening a portal it can't access.
// Change the role names if your backend uses different values for platformRole.
export const ROLE_HOME = {
  STUDENT: "/student/dashboard",
  TRAINER: "/trainer/dashboard",
  INSTITUTE_ADMIN: "/institute/dashboard",
  SUPER_ADMIN: "/superadmin/dashboard",
};

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  const location = useLocation();

  // AuthProvider already waits for session restore, this is just a safety net.
  if (loading) return null;

  // Not logged in: go to login and remember where the user wanted to go.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in but wrong portal: send them to their own dashboard.
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  }

  return <Outlet />;
}
