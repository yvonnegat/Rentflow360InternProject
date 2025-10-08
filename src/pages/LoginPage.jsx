import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Home,
  Login as LoginIcon,
} from "@mui/icons-material";

export default function LoginPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (!authContext) return <p>Loading...</p>;
  const { login } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={12}
          sx={{
            maxWidth: 480,
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 4,
              textAlign: "center",
            }}
          >
            <Home sx={{ fontSize: 56, mb: 1.5 }} />
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Sign in to continue to your account
            </Typography>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {/* Password Field */}
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              {/* Remember Me & Forgot Password */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Demo Accounts Info */}
            <Box
              sx={{
                bgcolor: "info.lighter",
                border: "1px solid",
                borderColor: "info.light",
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                fontWeight="600"
                color="info.dark"
                gutterBottom
              >
                Quick Demo Access
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                User: demo@user.com / demo123
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Agent: demo@agent.com / demo123
              </Typography>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>

            {/* Additional Help */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                By signing in, you agree to our{" "}
                <Link
                  component={RouterLink}
                  to="/terms"
                  sx={{ textDecoration: "none", color: "primary.main" }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  component={RouterLink}
                  to="/privacy"
                  sx={{ textDecoration: "none", color: "primary.main" }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}