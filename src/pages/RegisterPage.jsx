import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Fade,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  CheckCircle,
  Home,
  Business,
  AdminPanelSettings,
} from "@mui/icons-material";

export default function RegisterPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: "user",
    fullName: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  if (!authContext) return <p>Loading...</p>;
  const { register } = authContext;

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[@$!%*?&#]/.test(password)) strength += 10;

    if (strength < 40) return { strength, label: "Weak", color: "error" };
    if (strength < 70) return { strength, label: "Medium", color: "warning" };
    return { strength, label: "Strong", color: "success" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (activeStep === 1 && !form.fullName) {
      setError("Please enter your full name");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!form.email || !form.password || !form.confirmPassword) {
        setError("Please fill in all fields");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      setError("");
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setError("");
    setActiveStep(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    try {
      await register(form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const roleOptions = [
    {
      value: "user",
      label: "Regular User",
      icon: <Person />,
      description: "Browse and rent properties",
    },
    {
      value: "agent",
      label: "Property Agent",
      icon: <Business />,
      description: "List and manage properties",
    },
    {
      value: "admin",
      label: "Admin",
      icon: <AdminPanelSettings />,
      description: "Full platform access",
    },
  ];

  const steps = ["Account Details", "Personal Info"];

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
            maxWidth: 520,
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
            <Home sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Join us to find your perfect property
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ px: 4, pt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Fade in timeout={500}>
                  <Box>
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
                    />

                    {/* Password Strength Indicator */}
                    {form.password && (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Password Strength
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color={`${passwordStrength.color}.main`}
                            fontWeight="600"
                          >
                            {passwordStrength.label}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrength.strength}
                          color={passwordStrength.color}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    )}

                    {/* Confirm Password Field */}
                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      required
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={form.confirmPassword && form.password !== form.confirmPassword}
                      helperText={
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? "Passwords do not match"
                          : ""
                      }
                      sx={{ mb: 3 }}
                    />

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleNext}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                </Fade>
              )}

              {activeStep === 1 && (
                <Fade in timeout={500}>
                  <Box>
                    {/* Full Name Field */}
                    <TextField
                      label="Full Name"
                      type="text"
                      fullWidth
                      margin="normal"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />

                    {/* Phone Field (Optional) */}
                    <TextField
                      label="Phone Number (Optional)"
                      type="tel"
                      fullWidth
                      margin="normal"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      sx={{ mb: 3 }}
                    />

                    {/* Role Selection */}
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Select Account Type
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
                      {roleOptions.map((option) => (
                        <Card
                          key={option.value}
                          onClick={() => setForm({ ...form, role: option.value })}
                          sx={{
                            cursor: "pointer",
                            border: 2,
                            borderColor: form.role === option.value ? "primary.main" : "divider",
                            bgcolor: form.role === option.value ? "primary.lighter" : "background.paper",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: "primary.main",
                              transform: "translateY(-2px)",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                            <Box sx={{ color: "primary.main" }}>{option.icon}</Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight="600">
                                {option.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {option.description}
                              </Typography>
                            </Box>
                            {form.role === option.value && (
                              <CheckCircle color="primary" />
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        onClick={handleBack}
                        sx={{ py: 1.5, fontWeight: 600, textTransform: "none" }}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              )}
            </form>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {/* Login Link */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}