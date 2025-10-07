// src/components/user/ContactSellersPage.jsx
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";

export default function ContactSellersPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState({});
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
          if (propDoc.exists()) {
            favProperties.push({ id: propDoc.id, ...propDoc.data() });
          }
        }

        setFavorites(favProperties);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const handleSendMessage = async (propertyId, sellerId) => {
    const message = messages[propertyId];
    if (!message) return alert("Type a message first");

    try {
      // Store message in Firestore under "messages" collection
      await db.collection("messages").add({
        propertyId,
        sellerId,
        userId: user.uid,
        message,
        createdAt: new Date(),
      });
      alert("Message sent to seller!");
      setMessages({ ...messages, [propertyId]: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to send message: " + err.message);
    }
  };

  if (loading) return <Typography>Loading your favorite properties...</Typography>;
  if (favorites.length === 0)
    return <Typography>No favorite properties yet. Add some to contact sellers!</Typography>;

  return (
    <Grid container spacing={3}>
      {favorites.map((property) => (
        <Grid item xs={12} md={6} key={property.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{property.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Seller: {property.sellerEmail || "Unknown"}
              </Typography>
              <TextField
                label="Message to seller"
                multiline
                rows={3}
                fullWidth
                value={messages[property.id] || ""}
                onChange={(e) =>
                  setMessages({ ...messages, [property.id]: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleSendMessage(property.id, property.sellerId)}
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
