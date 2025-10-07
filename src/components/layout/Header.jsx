// src/components/layout/Header.jsx
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  alpha,
} from "@mui/material";
import {
  Home,
  Dashboard,
  Logout,
  Person,
  Menu as MenuIcon,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
      setAnchorEl(null);
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed: " + (err.message || err));
    }
  };

  const navLinks = [
    { label: "Home", path: "/", icon: <Home fontSize="small" /> },
    { label: "Listings", path: "/listings" },
  ];

  // Helper to get role-based dashboard
  const getDashboardLink = () => {
    if (!user) return null;

    switch (role?.toLowerCase()) {
      case "user":
        return {
          label: "Profile",
          path: "/dashboard/user",
          icon: <Dashboard fontSize="small" />,
        };
      case "agent":
        return {
          label: "Agent Dashboard",
          path: "/dashboard/agent",
          icon: <Dashboard fontSize="small" />,
        };
      case "admin":
        return {
          label: "Admin Dashboard",
          path: "/dashboard/admin",
          icon: <AdminPanelSettings fontSize="small" />,
        };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: "linear-gradient(135deg, #183B4E 0%, #27548A 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home sx={{ color: "#DDA853", fontSize: 28 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.3rem",
              background: "linear-gradient(135deg, #ffffff 0%, #F3F3E0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: { xs: "none", sm: "block" },
            }}
          >
            Rentflow360
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={Link}
              to={link.path}
              startIcon={link.icon}
              sx={{
                color: "white",
                fontWeight: 600,
                px: 2,
                "&:hover": { bgcolor: alpha("#DDA853", 0.15) },
              }}
            >
              {link.label}
            </Button>
          ))}

          {dashboardLink && (
            <Button
              component={Link}
              to={dashboardLink.path}
              startIcon={dashboardLink.icon}
              sx={{
                color: "white",
                fontWeight: 600,
                px: 2,
                "&:hover": { bgcolor: alpha("#DDA853", 0.15) },
              }}
            >
              {dashboardLink.label}
            </Button>
          )}

          {/* Auth Buttons */}
          {user ? (
            <>
              <Chip
                avatar={<Avatar sx={{ bgcolor: "#DDA853" }}>{user.email?.[0]?.toUpperCase()}</Avatar>}
                label={user.email?.split("@")[0] || "User"}
                sx={{ bgcolor: alpha("#fff", 0.15), color: "white", fontWeight: 600, ml: 1 }}
              />
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "white" }}>
                <Person />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: alpha("#fff", 0.3),
                  fontWeight: 600,
                  "&:hover": { borderColor: "#DDA853", bgcolor: alpha("#DDA853", 0.1) },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: "#DDA853",
                  color: "white",
                  fontWeight: 600,
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#c89642", boxShadow: 4 },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton sx={{ display: { md: "none" }, color: "white" }} onClick={(e) => setMobileMenuAnchor(e.currentTarget)}>
          <MenuIcon />
        </IconButton>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={() => setMobileMenuAnchor(null)}
          PaperProps={{ sx: { width: 250 } }}
        >
          {navLinks.map((link) => (
            <MenuItem
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setMobileMenuAnchor(null)}
            >
              {link.icon} <Box sx={{ ml: 1 }}>{link.label}</Box>
            </MenuItem>
          ))}

          {dashboardLink && (
            <MenuItem
              component={Link}
              to={dashboardLink.path}
              onClick={() => setMobileMenuAnchor(null)}
            >
              {dashboardLink.icon} <Box sx={{ ml: 1 }}>{dashboardLink.label}</Box>
            </MenuItem>
          )}

          {user ? (
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" /> <Box sx={{ ml: 1 }}>Logout</Box>
            </MenuItem>
          ) : (
            <>
              <MenuItem component={Link} to="/login" onClick={() => setMobileMenuAnchor(null)}>Login</MenuItem>
              <MenuItem component={Link} to="/register" onClick={() => setMobileMenuAnchor(null)}>Register</MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
