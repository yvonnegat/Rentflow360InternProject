import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if this property is already favorited
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
    e.preventDefault(); // prevent link navigation
    if (!user) return alert("Please log in to save favorites");
    const userRef = doc(db, "users", user.uid);

    try {
      if (isFavorited) {
        await updateDoc(userRef, { favorites: arrayRemove(property.id) });
        setIsFavorited(false); // update UI immediately
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(property.id) });
        setIsFavorited(true); // update UI immediately
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link to={`/property/${property.id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": { transform: "scale(1.02)", boxShadow: "0 6px 16px rgba(0,0,0,0.12)" },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={property.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={property.title}
        />

        {user && (
          <IconButton
            onClick={toggleFavorite}
            color="error"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
          >
            {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}

        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
            {property.title}
          </Typography>
          <Typography color="text.secondary" gutterBottom noWrap>
            {property.location}
          </Typography>
          {property.size && <Typography color="text.secondary">{property.size}</Typography>}
          <Typography color="primary" fontWeight="bold">
            {property.price}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PropertyCard;
