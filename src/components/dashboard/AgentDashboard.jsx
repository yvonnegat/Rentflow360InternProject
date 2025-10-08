import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Add, Edit, Delete } from "@mui/icons-material";
import Layout from "../layout/Layout"; // ✅ Added layout import

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [properties, setProperties] = useState([]);
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    location: "",
    imageUrl: "",
  });

  // Analytics
  const [totalListings, setTotalListings] = useState(0);
  const [approvedListings, setApprovedListings] = useState(0);
  const [pendingListings, setPendingListings] = useState(0);
  const [totalViewings, setTotalViewings] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const propQuery = query(collection(db, "properties"), where("agentId", "==", user.uid));
        const propSnapshot = await getDocs(propQuery);
        const propData = propSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const viewQuery = query(collection(db, "viewings"), where("propertyOwnerId", "==", user.uid));
        const viewSnapshot = await getDocs(viewQuery);
        const viewData = viewSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setTotalListings(propData.length);
        setApprovedListings(propData.filter((p) => p.status === "approved").length);
        setPendingListings(propData.filter((p) => p.status === "pending").length);
        setTotalViewings(viewData.length);

        setProperties(propData);
        setViewings(viewData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleOpenDialog = (property = null) => {
    setEditingProperty(property);
    setFormData(
      property || {
        title: "",
        description: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        price: "",
        location: "",
        imageUrl: "",
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingProperty(null);
    setOpenDialog(false);
  };

  const handleSaveProperty = async () => {
    try {
      if (editingProperty) {
        const propRef = doc(db, "properties", editingProperty.id);
        await updateDoc(propRef, formData);
        setProperties((prev) =>
          prev.map((p) => (p.id === editingProperty.id ? { ...p, ...formData } : p))
        );
      } else {
        await addDoc(collection(db, "properties"), {
          ...formData,
          agentId: user.uid,
          status: "pending",
          createdAt: serverTimestamp(),
        });
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving property:", err);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "properties", id));
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const handleUpdateViewing = async (viewingId, newStatus) => {
    try {
      await updateDoc(doc(db, "viewings", viewingId), { status: newStatus });
      setViewings((prev) =>
        prev.map((v) => (v.id === viewingId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error("Error updating viewing status:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Agent Dashboard
        </Typography>

        {/* Summary Stats */}
        <Grid container spacing={2} mb={4}>
          <DashboardCard title="Total Listings" value={totalListings} color="#27548A" />
          <DashboardCard title="Approved Listings" value={approvedListings} color="#3CB371" />
          <DashboardCard title="Pending Listings" value={pendingListings} color="#DDA853" />
          <DashboardCard title="Total Viewings" value={totalViewings} color="#4682B4" />
        </Grid>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          sx={{
            mb: 3,
            "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
          }}
        >
          <Tab label="My Listings" />
          <Tab label="Viewings" />
        </Tabs>

        {/* My Listings */}
        {tab === 0 && (
          <>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ mb: 3 }}
              onClick={() => handleOpenDialog()}
            >
              Add New Listing
            </Button>

            <Grid container spacing={3}>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        transition: "0.3s",
                        "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={property.imageUrl}
                        alt={property.title}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight={600}>
                          {property.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.location}
                        </Typography>
                        <Typography fontWeight={600} mt={1}>
                          Ksh {property.price}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          {property.bedrooms} Bed | {property.bathrooms} Bath
                        </Typography>
                        <Chip
                          label={property.status}
                          sx={{
                            mt: 1,
                            bgcolor:
                              property.status === "approved"
                                ? "success.light"
                                : "warning.light",
                          }}
                        />
                        <Stack direction="row" spacing={1} mt={2}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => handleOpenDialog(property)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No listings found.</Typography>
              )}
            </Grid>
          </>
        )}

        {/* Viewings Tab */}
        {tab === 1 && (
          <Grid container spacing={3}>
            {viewings.length > 0 ? (
              viewings.map((v) => (
                <Grid item xs={12} md={6} key={v.id}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h6">{v.propertyTitle}</Typography>
                    <Typography variant="body2">Client: {v.clientName}</Typography>
                    <Typography variant="body2">Date: {v.date}</Typography>
                    <Chip label={v.status} sx={{ mt: 1 }} />
                    <Stack direction="row" spacing={1} mt={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleUpdateViewing(v.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleUpdateViewing(v.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No viewing requests yet.</Typography>
            )}
          </Grid>
        )}

        {/* Dialog for Add/Edit Property */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>{editingProperty ? "Edit Listing" : "Add New Listing"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              select
              label="Type"
              fullWidth
              margin="dense"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="studio">Studio</MenuItem>
            </TextField>
            <TextField
              label="Bedrooms"
              type="number"
              fullWidth
              margin="dense"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            />
            <TextField
              label="Bathrooms"
              type="number"
              fullWidth
              margin="dense"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            />
            <TextField
              label="Price (Ksh)"
              type="number"
              fullWidth
              margin="dense"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              margin="dense"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              label="Image URL"
              fullWidth
              margin="dense"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveProperty}>
              {editingProperty ? "Save Changes" : "Add Listing"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

function DashboardCard({ title, value, color }) {
  return (
    <Grid item xs={6} sm={4} md={2.4}>
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: color,
          color: "white",
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2">{title}</Typography>
      </Card>
    </Grid>
  );
}
