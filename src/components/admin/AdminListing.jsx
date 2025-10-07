import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; // adjust path to your firebase.js

export default function AdminListings({ items = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  if (!items || items.length === 0) {
    return <p>No listings available.</p>;
  }

  const handleActionClick = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (!selectedItem) return;

    try {
      const docRef = doc(db, "properties", selectedItem.id);
      await updateDoc(docRef, {
        status: actionType === "approve" ? "approved" : "rejected",
      });
    } catch (err) {
      console.error("Error updating listing:", err);
    }

    handleCloseDialog();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.ownerName || "Unknown"}</TableCell>
                <TableCell>
                  <Chip
                    label={(item.status || "N/A").toUpperCase()}
                    color={
                      item.status === "approved"
                        ? "success"
                        : item.status === "pending"
                        ? "warning"
                        : item.status === "rejected"
                        ? "error"
                        : "default"
                    }
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  {item.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                </TableCell>
                <TableCell>
                  {item.status === "pending" && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        onClick={() => handleActionClick(item, "approve")}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleActionClick(item, "reject")}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, m: { xs: 2, md: 3 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionType === "approve" ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircle color="success" />
              <span>Approve Listing?</span>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Warning color="error" />
              <span>Reject Listing?</span>
            </Stack>
          )}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, color: "text.secondary" }}>
            {selectedItem?.title || "No listing selected"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <Button onClick={handleCloseDialog} variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            size="small"
            sx={{ minWidth: 100 }}
          >
            {actionType === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
