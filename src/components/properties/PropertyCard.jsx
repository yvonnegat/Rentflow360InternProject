import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { 
  Card, CardContent, CardMedia, Typography, IconButton, 
  Box, Chip, Tooltip, Fade 
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const favs = userDoc.data()?.favorites || [];
      setIsFavorited(favs.includes(property.id));
    };
    checkFavorite();
  }, [user, property.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to save favorites");
    const userRef = doc(db, "users", user.uid);

    try {
      if (isFavorited) {
        await updateDoc(userRef, { favorites: arrayRemove(property.id) });
        setIsFavorited(false);
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(property.id) });
        setIsFavorited(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fade in timeout={500}>
      <Link to={`/property/${property.id}`} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            position: "relative",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            "&:hover": { 
              transform: "translateY(-8px)", 
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
              borderColor: "primary.main",
            },
          }}
        >
          {/* Image Container with Overlay */}
          <Box sx={{ position: "relative", overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="220"
              image={property.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
              alt={property.title}
              onLoad={() => setImageLoaded(true)}
              sx={{
                transition: "transform 0.4s ease",
                bgcolor: "action.hover",
                "&:hover": { transform: "scale(1.08)" },
              }}
            />

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Featured Badge (optional - can be conditional) */}
            {property.featured && (
              <Chip
                label="Featured"
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "success.main",
                  color: "white",
                  fontWeight: 600,
                  boxShadow: 2,
                }}
              />
            )}

            {/* Favorite Button */}
            {user && (
              <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                <IconButton
                  onClick={toggleFavorite}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s",
                    "&:hover": { 
                      bgcolor: "white",
                      transform: "scale(1.15)",
                    },
                    boxShadow: 2,
                  }}
                >
                  {isFavorited ? (
                    <FavoriteIcon sx={{ color: "error.main" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Price Tag */}
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: 2,
                py: 0.75,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" fontWeight="700">
                {property.price}
              </Typography>
            </Box>
          </Box>

          {/* Content Section */}
          <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
            {/* Title */}
            <Typography 
              variant="h6" 
              fontWeight="600" 
              gutterBottom 
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                minHeight: "3.2em",
                mb: 1.5,
              }}
            >
              {property.title}
            </Typography>

            {/* Location */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
              <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                noWrap
                sx={{ flex: 1 }}
              >
                {property.location}
              </Typography>
            </Box>

            {/* Property Features */}
            <Box 
              sx={{ 
                display: "flex", 
                gap: 2, 
                pt: 2, 
                mt: "auto",
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              {property.bedrooms && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <BedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" fontWeight="500">
                    {property.bedrooms}
                  </Typography>
                </Box>
              )}

              {property.bathrooms && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <BathtubIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" fontWeight="500">
                    {property.bathrooms}
                  </Typography>
                </Box>
              )}

              {property.size && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SquareFootIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" fontWeight="500" noWrap>
                    {property.size}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Link>
    </Fade>
  );
}

export default PropertyCard;