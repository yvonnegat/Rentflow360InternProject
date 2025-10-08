import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 🟡 Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🟢 Get role from user object
  const userRole = user.role || "user";

  // 🔴 Logged in but role not allowed → redirect home
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // 🟢 Allowed → show content
  return children;
}
