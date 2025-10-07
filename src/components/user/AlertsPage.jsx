// src/components/user/AlertsPage.jsx
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import PropertyCard from "../properties/PropertyCard";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({ type: "location", value: "" });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user alerts
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setAlerts(docSnap.data().alerts || []);
      }
    });

    return () => unsub();
  }, [user]);

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      const propsSnap = await getDocs(collection(db, "properties"));
      setProperties(propsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchProperties();
  }, []);

  // Add new alert
  const handleAddAlert = async () => {
    if (!newAlert.value) return alert("Please enter a value");
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { alerts: arrayUnion(newAlert) });
    setNewAlert({ type: "location", value: "" });
  };

  // Delete an alert
  const handleDeleteAlert = async (alert) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { alerts: arrayRemove(alert) });
  };

  // Filter properties by alerts
  const matchedProperties = properties.filter((property) =>
    alerts.some((alert) => {
      if (alert.type === "location") return property.location?.includes(alert.value);
      if (alert.type === "price") return property.price <= Number(alert.value);
      if (alert.type === "propertyType") return property.type === alert.value;
      return false;
    })
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Property Alerts
      </Typography>

      {/* Add Alert Form */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          select
          label="Type"
          value={newAlert.type}
          onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
          SelectProps={{ native: true }}
        >
          <option value="location">Location</option>
          <option value="price">Max Price</option>
          <option value="propertyType">Property Type</option>
        </TextField>

        <TextField
          label="Value"
          value={newAlert.value}
          onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
        />

        <Button variant="contained" color="primary" onClick={handleAddAlert}>
          Add Alert
        </Button>
      </Box>

      {/* List Current Alerts */}
      <Box sx={{ mb: 3 }}>
        {alerts.length === 0 && <Typography>No alerts set yet.</Typography>}
        {alerts.map((alert, index) => (
          <Chip
            key={index}
            label={`${alert.type}: ${alert.value}`}
            onDelete={() => handleDeleteAlert(alert)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      {/* Display Matched Properties */}
      {loading ? (
        <Typography>Loading properties...</Typography>
      ) : matchedProperties.length === 0 ? (
        <Typography>No properties match your alerts yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {matchedProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
