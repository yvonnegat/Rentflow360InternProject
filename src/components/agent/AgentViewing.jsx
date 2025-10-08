// src/pages/agent/AgentViewings.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CheckCircle, Cancel, DoneAll } from "@mui/icons-material";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function AgentViewings() {
  const { user } = useAuth();
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "viewings"), where("propertyOwnerId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setViewings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const ref = doc(db, "viewings", id);
      await updateDoc(ref, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Viewing Requests
      </Typography>

      {viewings.length === 0 ? (
        <Typography color="text.secondary">No viewing requests yet.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#183B4E" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Property</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {viewings.map((v) => (
                <TableRow key={v.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{v.propertyTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {v.propertyLocation}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{v.userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {v.userPhone}
                    </Typography>
                  </TableCell>

                  <TableCell>{v.viewingDate}</TableCell>
                  <TableCell>{v.viewingTime}</TableCell>

                  <TableCell>
                    <Chip
                      label={v.status}
                      color={
                        v.status === "approved"
                          ? "success"
                          : v.status === "rejected"
                          ? "error"
                          : v.status === "completed"
                          ? "info"
                          : "warning"
                      }
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell>
                    {v.status === "pending" && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton color="success" onClick={() => handleStatusChange(v.id, "approved")}>
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton color="error" onClick={() => handleStatusChange(v.id, "rejected")}>
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {v.status === "approved" && (
                      <Tooltip title="Mark Completed">
                        <IconButton color="info" onClick={() => handleStatusChange(v.id, "completed")}>
                          <DoneAll />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
