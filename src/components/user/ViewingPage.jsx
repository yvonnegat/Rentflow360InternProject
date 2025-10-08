// src/pages/user/ViewingsPage.jsx
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Card, CardContent, Typography, Grid, Chip, CircularProgress } from "@mui/material";

export default function ViewingsPage() {
  const { user } = useAuth();
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchViewings = async () => {
      try {
        const q = query(collection(db, "viewings"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setViewings(data);
      } catch (error) {
        console.error("Error fetching viewings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViewings();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (viewings.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        You have no scheduled property viewings yet.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {viewings.map((v) => (
        <Grid item xs={12} md={6} key={v.id}>
          <Card sx={{ borderLeft: `4px solid #2196f3` }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                {v.propertyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Location: {v.propertyLocation}
              </Typography>
              <Typography variant="body2">Date: {v.viewingDate}</Typography>
              <Typography variant="body2">Time: {v.viewingTime}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Message: {v.message || "No message"}
              </Typography>
              <Chip
                label={v.status || "pending"}
                size="small"
                sx={{
                  mt: 1.5,
                  bgcolor:
                    v.status === "approved"
                      ? "#4caf50"
                      : v.status === "rejected"
                      ? "#f44336"
                      : "#ff9800",
                  color: "#fff",
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
