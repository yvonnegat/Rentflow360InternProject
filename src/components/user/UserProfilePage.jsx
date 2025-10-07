// src/components/user/UserProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { updatePassword, updateEmail } from "firebase/auth";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({ email: user.email, phone: data.phone || "" });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setError("");
    setMessage("");
    if (!user) return;

    try {
      // Update email in Firebase Auth
      if (profile.email !== user.email) {
        await updateEmail(user, profile.email);
      }

      // Update phone in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { phone: profile.phone });

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <Typography>Loading profile...</Typography>;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Email"
        name="email"
        fullWidth
        sx={{ mb: 2 }}
        value={profile.email}
        onChange={handleChange}
      />

      <TextField
        label="Phone Number"
        name="phone"
        fullWidth
        sx={{ mb: 2 }}
        value={profile.phone}
        onChange={handleChange}
      />

      <Button variant="contained" fullWidth onClick={handleUpdate}>
        Update Profile
      </Button>
    </Box>
  );
}
