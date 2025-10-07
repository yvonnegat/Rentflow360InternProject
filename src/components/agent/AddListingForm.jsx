// src/components/agent/AddListingForm.jsx
import { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function AddListingForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    imageUrl: "", // <-- store image URL
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in as an agent");

    setLoading(true);
    try {
      // Save property in Firestore
      await addDoc(collection(db, "properties"), {
        ...form,
        agentId: user.uid,
        status: "pending", // admin will approve
        createdAt: serverTimestamp(),
      });

      alert("Listing added successfully!");
      setForm({
        title: "",
        location: "",
        price: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        imageUrl: "",
      });
    } catch (err) {
      console.error("Error adding listing:", err);
      alert("Error adding listing: " + err.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add New Listing
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Location"
          name="location"
          fullWidth
          margin="normal"
          value={form.location}
          onChange={handleChange}
          required
        />
        <TextField
          label="Price"
          name="price"
          fullWidth
          margin="normal"
          value={form.price}
          onChange={handleChange}
          required
        />
        <TextField
          label="Type"
          name="type"
          fullWidth
          margin="normal"
          value={form.type}
          onChange={handleChange}
        />
        <TextField
          label="Bedrooms"
          name="bedrooms"
          fullWidth
          margin="normal"
          value={form.bedrooms}
          onChange={handleChange}
        />
        <TextField
          label="Bathrooms"
          name="bathrooms"
          fullWidth
          margin="normal"
          value={form.bathrooms}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          label="Image URL"
          name="imageUrl"
          fullWidth
          margin="normal"
          value={form.imageUrl}
          onChange={handleChange}
          required
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Adding Listing..." : "Add Listing"}
        </Button>
      </form>
    </Box>
  );
}
