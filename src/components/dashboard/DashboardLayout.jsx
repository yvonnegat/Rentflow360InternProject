import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ title, children }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #004e92 0%, #000428 100%)",
        color: "#fff",
        padding: "30px",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          {title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => navigate("/")} sx={{ backgroundColor: "#00bcd4" }}>
            Back to Home
          </Button>
        </Box>

        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
