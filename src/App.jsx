import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PropertyListPage from "./pages/PropertyListPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import PropertyPhotoPage from "./pages/PropertyPhotoPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoutes.jsx";
import UserDashboard from "./components/dashboard/UserDashboard.jsx";
import AgentDashboard from "./components/dashboard/AgentDashboard.jsx";
import AdminDashboard from "./components/dashboard/AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<PropertyListPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/property/photo/:id" element={<PropertyPhotoPage />} /> 

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute allowedRoles={["user", "agent", "admin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/agent"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
