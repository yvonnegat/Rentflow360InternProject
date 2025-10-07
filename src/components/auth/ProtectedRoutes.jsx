
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role } = useAuth();

  // 🟡 Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Logged in but role not allowed → redirect home
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 🟢 Allowed → show content
  return children;
}
