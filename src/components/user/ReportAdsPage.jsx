// src/components/user/ReportAdsPage.jsx
import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function ReportAdsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState("");

  const handleSubmit = async () => {
    if (!report) return alert("Please enter a report");
    if (!user) return alert("Please login first");

    try {
      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        userEmail: user.email,
        report,
        createdAt: new Date(),
      });
      alert("Report submitted!");
      setReport("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit report: " + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Report an Ad
      </Typography>
      <TextField
        label="Describe the issue"
        multiline
        rows={4}
        fullWidth
        value={report}
        onChange={(e) => setReport(e.target.value)}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
