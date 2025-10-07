// src/pages/RegisterPage.jsx
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
} from "@mui/material";

export default function RegisterPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authContext) return <p>Loading...</p>;
  const { register } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.email, form.password, form.role);
      navigate("/"); // redirect after registration
    } catch (err) {
      setError(err.message);
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
        bgcolor: "#f4f4f4",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          bgcolor: "#fff",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Register As</InputLabel>
            <Select
              labelId="role-label"
              value={form.role}
              label="Register As"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="user">Regular User</MenuItem>
              <MenuItem value="agent">Property Agent</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.5, background: "#004e92" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {error && (
          <Typography sx={{ mt: 2, color: "red", textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
