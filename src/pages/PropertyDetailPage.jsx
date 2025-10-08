import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  addDoc,
  collection,
  serverTimestamp 
} from "firebase/firestore";
import Layout from "../components/layout/Layout";
import { 
  Box, Typography, Grid, Button, Chip, Divider, IconButton, 
  Paper, Stack, Card, CardContent, Container, Tooltip, Fade,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Scheduling dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  
  // Form data
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });

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

  // Pre-fill form with user data when dialog opens
  useEffect(() => {
    if (scheduleDialogOpen && user) {
      setScheduleForm(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [scheduleDialogOpen, user]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleScheduleClick = () => {

    if (!user) {
      alert("Please log in to schedule a viewing");
      navigate("/login");
      return;
    }
    console.log("Current user:", user);
    // Check if user is a regular user (not landlord/admin)
    if (user.role !== "user") {
      alert("Property viewing scheduling is only available for regular users");
      return;
    }

    setScheduleDialogOpen(true);
  };

  const handleScheduleClose = () => {
    setScheduleDialogOpen(false);
    setScheduleError("");
    setScheduleSuccess(false);
    // Reset form
    setScheduleForm({
      name: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      date: "",
      time: "",
      message: ""
    });
  };

  const handleFormChange = (e) => {
    setScheduleForm({
      ...scheduleForm,
      [e.target.name]: e.target.value
    });
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSchedulingLoading(true);
    setScheduleError("");

    try {
      // Validate form
      if (!scheduleForm.name || !scheduleForm.email || !scheduleForm.phone || 
          !scheduleForm.date || !scheduleForm.time) {
        setScheduleError("Please fill in all required fields");
        setSchedulingLoading(false);
        return;
      }

      // Validate date is not in the past
      const selectedDate = new Date(scheduleForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setScheduleError("Please select a future date");
        setSchedulingLoading(false);
        return;
      }

      // Create viewing appointment document
      const viewingData = {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyOwnerId: property.agentId || property.userId,
        userId: user.uid,
        userName: scheduleForm.name,
        userEmail: scheduleForm.email,
        userPhone: scheduleForm.phone,
        viewingDate: scheduleForm.date,
        viewingTime: scheduleForm.time,
        message: scheduleForm.message,
        status: "pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "viewings"), viewingData);
      
      setScheduleSuccess(true);
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleScheduleClose();
      }, 2000);

    } catch (error) {
      console.error("Error scheduling viewing:", error);
      setScheduleError("Failed to schedule viewing. Please try again.");
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Get minimum date (today) for date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading)
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6" color="text.secondary">Loading property...</Typography>
        </Box>
      </Layout>
    );

  if (!property)
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6" color="text.secondary">Property not found.</Typography>
        </Box>
      </Layout>
    );

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header with Back Button */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "action.hover" }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="600">Property Details</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} lg={7}>
            <Fade in timeout={600}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    boxShadow: 6,
                    transform: "translateY(-4px)"
                  },
                }}
                onClick={() => navigate(`/property/photo/${property.id}`)}
              >
                <Box
                  component="img"
                  src={property.imageUrl || "https://via.placeholder.com/800x600?text=No+Image"}
                  alt={property.title}
                  sx={{
                    width: "100%",
                    height: { xs: 320, sm: 420, md: 520, lg: 580 },
                    objectFit: "cover",
                  }}
                />
                
                {/* Floating Action Buttons */}
                <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
                  <Tooltip title="Share property">
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); handleShare(); }}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { bgcolor: "rgba(255,255,255,1)", transform: "scale(1.1)" },
                        transition: "all 0.2s",
                        boxShadow: 2,
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  
                  {user && (
                    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.95)",
                          backdropFilter: "blur(10px)",
                          "&:hover": { 
                            bgcolor: "rgba(255,255,255,1)", 
                            transform: "scale(1.1)" 
                          },
                          transition: "all 0.2s",
                          boxShadow: 2,
                        }}
                      >
                        {isFavorite ? (
                          <FavoriteIcon sx={{ color: "error.main" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Click to View Hint */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    bgcolor: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption">Click to view full image</Typography>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} lg={5}>
            <Fade in timeout={800}>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Title and Location Card */}
                <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" fontWeight="700" gutterBottom sx={{ wordBreak: "break-word" }}>
                      {property.title}
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <LocationOnIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography variant="body1" color="text.secondary">
                        {property.location}
                      </Typography>
                    </Box>

                    <Box 
                      sx={{ 
                        bgcolor: "primary.main", 
                        color: "primary.contrastText",
                        px: 2.5,
                        py: 1.5,
                        borderRadius: 2,
                        display: "inline-block",
                        mt: 1
                      }}
                    >
                      <Typography variant="h5" fontWeight="700">
                        {property.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Quick Stats Card */}
                <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={2}>
                      Property Features
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                          <BedIcon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                          <Typography variant="h6" fontWeight="600">{property.bedrooms}</Typography>
                          <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                          <BathtubIcon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                          <Typography variant="h6" fontWeight="600">{property.bathrooms}</Typography>
                          <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                        </Box>
                      </Grid>
                      {property.size && (
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                            <SquareFootIcon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                            <Typography variant="h6" fontWeight="600">{property.size}</Typography>
                            <Typography variant="caption" color="text.secondary">Area</Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Description Card */}
                <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={2}>
                      Description
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {property.description}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Amenities Card */}
                {property.amenities?.length > 0 && (
                  <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" mb={2}>
                        Amenities
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {property.amenities.map((a, idx) => (
                          <Chip 
                            key={idx} 
                            label={a} 
                            color="primary" 
                            variant="outlined"
                            sx={{ 
                              fontWeight: 500,
                              "&:hover": { bgcolor: "primary.main", color: "white" }
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Safety Tips Card */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    border: "1px solid", 
                    borderColor: "warning.main",
                    borderRadius: 3,
                    bgcolor: "warning.lighter"
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <SecurityIcon sx={{ color: "warning.main" }} />
                      <Typography variant="h6" fontWeight="600" color="warning.dark">
                        Safety Tips
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                      Always visit properties during the day and bring someone you trust. 
                      Never share personal financial information until you've verified the property and landlord.
                    </Typography>
                  </CardContent>
                </Card>

                {/* Action Button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  onClick={handleScheduleClick}
                  sx={{ 
                    py: 1.8, 
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: 3,
                    "&:hover": { 
                      boxShadow: 6,
                      transform: "translateY(-2px)"
                    },
                    transition: "all 0.3s"
                  }}
                >
                  Schedule Property Viewing
                </Button>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Schedule Viewing Dialog */}
      <Dialog 
        open={scheduleDialogOpen} 
        onClose={handleScheduleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonthIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Schedule Property Viewing
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {property.title}
          </Typography>
        </DialogTitle>

        <form onSubmit={handleScheduleSubmit}>
          <DialogContent dividers>
            {scheduleError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {scheduleError}
              </Alert>
            )}

            {scheduleSuccess && (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ mb: 2 }}
              >
                Viewing scheduled successfully! The property owner will contact you soon.
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                name="name"
                value={scheduleForm.name}
                onChange={handleFormChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={scheduleForm.email}
                onChange={handleFormChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                }}
              />

              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={scheduleForm.phone}
                onChange={handleFormChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                }}
              />

              <TextField
                label="Preferred Date"
                name="date"
                type="date"
                value={scheduleForm.date}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getMinDate() }}
              />

              <TextField
                label="Preferred Time"
                name="time"
                type="time"
                value={scheduleForm.time}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "action.active" }} />
                }}
              />

              <TextField
                label="Additional Message (Optional)"
                name="message"
                value={scheduleForm.message}
                onChange={handleFormChange}
                multiline
                rows={3}
                fullWidth
                placeholder="Any specific requirements or questions..."
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button 
              onClick={handleScheduleClose}
              disabled={schedulingLoading}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={schedulingLoading || scheduleSuccess}
              startIcon={schedulingLoading ? <CircularProgress size={20} /> : <CalendarMonthIcon />}
              sx={{ textTransform: "none", minWidth: 120 }}
            >
              {schedulingLoading ? "Scheduling..." : "Schedule Viewing"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
}

export default PropertyDetailsPage;