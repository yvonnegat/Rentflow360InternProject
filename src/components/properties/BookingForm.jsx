import { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Button, TextField } from "@mui/material";

function BookViewing({ propertyId }) {
  const { user } = useAuth();
  const [date, setDate] = useState("");

  const handleBooking = async () => {
    if (!user) return alert("Please log in to book a viewing");
    if (!date) return alert("Please select a date and time");

    await addDoc(collection(db, "bookings"), {
      propertyId,
      userId: user.uid,
      date,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    alert("Booking requested successfully!");
  };

  return (
    <div>
      <TextField
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleBooking} sx={{ mt: 2 }}>
        Book Viewing
      </Button>
    </div>
  );
}

export default BookViewing;
