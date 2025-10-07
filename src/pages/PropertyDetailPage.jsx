import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Layout from "../components/layout/Layout";
import { Box, Typography, Grid, Button, Chip, Divider, IconButton, Paper, Stack } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const docRef = doc(db, "properties", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProperty({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (user && property) setIsFavorite(user.favorites?.includes(property.id));
  }, [user, property]);

  const toggleFavorite = async () => {
    if (!user) return alert("Please log in to save favorites");
    const userRef = doc(db, "users", user.uid);
    if (isFavorite) {
      await updateDoc(userRef, { favorites: arrayRemove(property.id) });
      setIsFavorite(false);
    } else {
      await updateDoc(userRef, { favorites: arrayUnion(property.id) });
      setIsFavorite(true);
    }
  };

  if (loading)
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: "center" }}>Loading property...</Box>
      </Layout>
    );

  if (!property)
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: "center" }}>Property not found.</Box>
      </Layout>
    );

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => navigate(`/property/photo/${property.id}`)}
            >
              <Box
                component="img"
                src={property.imageUrl || "https://via.placeholder.com/800x600?text=No+Image"}
                alt={property.title}
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 380, md: 500 },
                  objectFit: "cover",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              />
              {user && (
                <IconButton
                  onClick={toggleFavorite}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    width: 48,
                    height: 48,
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              )}
            </Paper>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h4" fontWeight="bold" sx={{ wordBreak: "break-word" }}>
              {property.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">{property.location}</Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">{property.price}</Typography>

            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography><strong>Bedrooms:</strong> {property.bedrooms}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography><strong>Bathrooms:</strong> {property.bathrooms}</Typography>
              </Grid>
              {property.size && (
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Size:</strong> {property.size}</Typography>
                </Grid>
              )}
            </Grid>

            <Divider />

            <Box>
              <Typography variant="h6" mb={1}>Description</Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>{property.description}</Typography>
            </Box>

            {property.amenities?.length > 0 && (
              <Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" mb={1}>Amenities</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {property.amenities.map((a, idx) => (
                    <Chip key={idx} label={a} color="primary" variant="outlined" size="small"/>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />
            <Box>
              <Typography variant="h6" mb={1}>Safety Tips</Typography>
              <Typography color="text.secondary">
                Always visit properties during the day and bring someone you trust.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, alignSelf: { xs: "stretch", md: "flex-start" }, py: 1.5, fontWeight: 600 }}
            >
              Book Viewing
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default PropertyDetailsPage;
