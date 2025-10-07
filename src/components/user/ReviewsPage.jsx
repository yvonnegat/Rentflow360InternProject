// src/components/user/ReviewsPage.jsx
import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    if (!review) return alert("Please write a review");
    if (!user) return alert("Please login first");

    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userEmail: user.email,
        review,
        createdAt: new Date(),
      });
      alert("Review submitted!");
      setReview("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review: " + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Leave a Review
      </Typography>
      <TextField
        label="Your review"
        multiline
        rows={4}
        fullWidth
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
