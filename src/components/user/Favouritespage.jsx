import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import PropertyCard from "../properties/PropertyCard";
import { Box, Typography, Grid } from "@mui/material";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const favIds = userDoc.data()?.favorites || [];
        const favProperties = [];
        for (let id of favIds) {
          const propDoc = await getDoc(doc(db, "properties", id));
          if (propDoc.exists()) favProperties.push({ id: propDoc.id, ...propDoc.data() });
        }
        setFavorites(favProperties);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  if (loading) return <Typography>Loading favorites...</Typography>;
  if (favorites.length === 0)
    return <Typography>No favorite properties yet. Start browsing and add some!</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>My Favorite Properties</Typography>
      <Grid container spacing={3}>
        {favorites.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <PropertyCard property={property} userFavorites={favorites.map(f => f.id)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
