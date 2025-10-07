import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, CardContent, Typography, Box, CardMedia, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";

export default function AgentListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [editListing, setEditListing] = useState(null); // current listing being edited
  const [form, setForm] = useState({ title: "", location: "", price: "", type: "", bedrooms: "", bathrooms: "", description: "" });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "properties"), where("agentId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setListings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "properties", id));
    }
  };

  const handleEditOpen = (listing) => {
    setEditListing(listing);
    setForm({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      type: listing.type,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      description: listing.description,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditSave = async () => {
    if (!editListing) return;
    await updateDoc(doc(db, "properties", editListing.id), { ...form });
    setEditListing(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">My Listings</Typography>
      {listings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        listings.map((l) => (
          <Card key={l.id} sx={{ my: 2 }}>
            {l.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={l.imageUrl}
                alt={l.title}
              />
            )}
            <CardContent>
              <Typography variant="h6">{l.title}</Typography>
              <Typography>Location: {l.location}</Typography>
              <Typography>Price: {l.price}</Typography>
              <Typography>Status: {l.status}</Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Button onClick={() => handleEditOpen(l)} color="primary">Edit</Button>
                <Button onClick={() => handleDelete(l.id)} color="error">Delete</Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editListing} onClose={() => setEditListing(null)}>
        <DialogTitle>Edit Listing</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Title" name="title" value={form.title} onChange={handleEditChange} fullWidth />
          <TextField label="Location" name="location" value={form.location} onChange={handleEditChange} fullWidth />
          <TextField label="Price" name="price" value={form.price} onChange={handleEditChange} fullWidth />
          <TextField label="Type" name="type" value={form.type} onChange={handleEditChange} fullWidth />
          <TextField label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleEditChange} fullWidth />
          <TextField label="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleEditChange} fullWidth />
          <TextField label="Description" name="description" value={form.description} onChange={handleEditChange} fullWidth multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditListing(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
