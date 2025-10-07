import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AdminPanelSettings,
  People,
  Home,
  Report,
  Verified,
  NotificationsActive,
  Download,
  TrendingUp,
  CheckCircle,
  Warning,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import AdminListings from "../admin/AdminListing";
import Layout from "../layout/Layout";

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");

  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalListings: 0,
    pendingApproval: 0,
    activeAgents: 0,
    totalReports: 0,
    newReports: 0,
  });

  // Firestore subscriptions
  useEffect(() => {
    // Pending Listings
    const unsubscribePending = onSnapshot(
      query(collection(db, "properties"), where("status", "==", "pending")),
      (snapshot) => {
        const listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPendingListings(listings);
        setAdminStats((prev) => ({ ...prev, pendingApproval: listings.length }));
      }
    );

    // All Listings
    const unsubscribeAll = onSnapshot(collection(db, "properties"), (snapshot) => {
      const listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllListings(listings);
      setAdminStats((prev) => ({ ...prev, totalListings: listings.length }));
    });

    // Users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecentUsers(users);

      const totalUsers = users.length;
      const today = new Date();
      const newUsersToday = users.filter((u) => {
        const joinedDate = u.createdAt?.toDate?.() || new Date();
        return (
          joinedDate.getDate() === today.getDate() &&
          joinedDate.getMonth() === today.getMonth() &&
          joinedDate.getFullYear() === today.getFullYear()
        );
      }).length;

      const activeAgents = users.filter((u) => u.role === "agent").length;

      setAdminStats((prev) => ({ ...prev, totalUsers, newUsersToday, activeAgents }));
    });

    // Reports
    const unsubscribeReports = onSnapshot(
      query(collection(db, "reports"), where("status", "==", "pending")),
      (snapshot) => {
        const reports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReportedContent(reports);

        const today = new Date();
        const newReports = reports.filter((r) => r.createdAt?.toDate?.() > new Date(today.setHours(0, 0, 0, 0))).length;
        setAdminStats((prev) => ({ ...prev, totalReports: reports.length, newReports }));
      }
    );

    return () => {
      unsubscribePending();
      unsubscribeAll();
      unsubscribeUsers();
      unsubscribeReports();
    };
  }, []);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleApprove = (item) => {
    setSelectedItem(item);
    setActionType("approve");
    setOpenDialog(true);
  };

  const handleReject = (item) => {
    setSelectedItem(item);
    setActionType("reject");
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
      const docRef = doc(db, "listings", selectedItem.id);
      await updateDoc(docRef, {
        status: actionType === "approve" ? "approved" : "rejected",
      });
    } catch (err) {
      console.error("Error updating listing:", err);
    }
    handleCloseDialog();
  };

  // Stats card data
  const statsCards = [
    {
      title: "Total Users",
      value: adminStats.totalUsers,
      subtitle: `+${adminStats.newUsersToday} today`,
      icon: People,
      color: "#4CAF50",
      bgColor: alpha("#4CAF50", 0.1),
    },
    {
      title: "Listings",
      value: adminStats.totalListings,
      subtitle: `${adminStats.pendingApproval} pending`,
      icon: Home,
      color: "#2196F3",
      bgColor: alpha("#2196F3", 0.1),
    },
    {
      title: "Active Agents",
      value: adminStats.activeAgents,
      subtitle: "Verified agents",
      icon: Verified,
      color: "#FF9800",
      bgColor: alpha("#FF9800", 0.1),
    },
    {
      title: "Reports",
      value: adminStats.totalReports,
      subtitle: `${adminStats.newReports} new`,
      icon: Report,
      color: "#F44336",
      bgColor: alpha("#F44336", 0.1),
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: "#f5f7fa",
          minHeight: "100vh",
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <Paper
            elevation={0}
            sx={{
              mb: { xs: 3, md: 4 },
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.25)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(30%, -30%)",
              },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 60, md: 80 },
                      height: { xs: 60, md: 80 },
                      bgcolor: alpha("#ffffff", 0.2),
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <AdminPanelSettings sx={{ fontSize: { xs: 30, md: 40 } }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                        mb: 1,
                      }}
                    >
                      Admin Control Center
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      <Chip
                        icon={<Verified />}
                        label="Super Admin"
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          bgcolor: alpha("#ffffff", 0.2),
                          color: "white",
                          backdropFilter: "blur(10px)",
                          fontWeight: 600,
                        }}
                      />
                      {adminStats.newReports > 0 && (
                        <Chip
                          icon={<NotificationsActive />}
                          label={`${adminStats.newReports} New Alert${adminStats.newReports > 1 ? 's' : ''}`}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            bgcolor: alpha("#ff5252", 0.3),
                            color: "white",
                            backdropFilter: "blur(10px)",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                >
                  <Tooltip title="Refresh data">
                    <IconButton
                      sx={{
                        color: "white",
                        bgcolor: alpha("#ffffff", 0.1),
                        "&:hover": { bgcolor: alpha("#ffffff", 0.2) },
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    startIcon={!isMobile && <Download />}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      bgcolor: "white",
                      color: "#667eea",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: alpha("#ffffff", 0.9),
                      },
                    }}
                  >
                    {isMobile ? "Export" : "Export Data"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={6} sm={6} lg={3} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: stat.bgColor,
                              color: stat.color,
                              borderRadius: 2,
                              p: { xs: 1, md: 1.5 },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon sx={{ fontSize: { xs: 24, md: 32 } }} />
                          </Box>
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box>
                          <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{
                              fontSize: { xs: "1.75rem", md: "2.5rem" },
                              color: "text.primary",
                              mb: 0.5,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                            sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                          >
                            {stat.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: stat.color,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.5,
                              fontSize: { xs: "0.7rem", md: "0.75rem" },
                            }}
                          >
                            <TrendingUp fontSize="inherit" />
                            {stat.subtitle}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Tabs Section */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "white",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  px: { xs: 1, md: 2 },
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    minHeight: { xs: 48, md: 64 },
                  },
                }}
              >
                <Tab
                  label={
                    <Badge
                      badgeContent={pendingListings.length}
                      color="warning"
                      max={99}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                          fontWeight: 600,
                          pr: pendingListings.length > 0 ? 2 : 0,
                        }}
                      >
                        {isMobile ? "Pending" : "Pending Listings"}
                      </Typography>
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        fontWeight: 600,
                      }}
                    >
                      {isMobile ? `All (${allListings.length})` : `All Listings (${allListings.length})`}
                    </Typography>
                  }
                />
                <Tab
                  label={
                    <Badge
                      badgeContent={reportedContent.length}
                      color="error"
                      max={99}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                          fontWeight: 600,
                          pr: reportedContent.length > 0 ? 2 : 0,
                        }}
                      >
                        {isMobile ? "Reports" : "Reports"}
                      </Typography>
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        fontWeight: 600,
                      }}
                    >
                      {isMobile ? `Users (${recentUsers.length})` : `Users (${recentUsers.length})`}
                    </Typography>
                  }
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {activeTab === 0 && (
                <AdminListings
                  items={pendingListings}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              )}
              {activeTab === 1 && <AdminListings items={allListings} />}
              {activeTab === 2 && <AdminListings items={reportedContent} />}
              {activeTab === 3 && (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                          Name
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            Email
                          </TableCell>
                        )}
                        <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                          Role
                        </TableCell>
                        {!isMobile && (
                          <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            Date Joined
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((u) => (
                        <TableRow
                          key={u.id}
                          sx={{
                            "&:hover": { bgcolor: "#f8f9fa" },
                          }}
                        >
                          <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                                {u.firstName?.[0]}{u.lastName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" }, fontWeight: 600 }}>
                                  {u.firstName} {u.lastName}
                                </Typography>
                                {isMobile && (
                                  <Typography variant="caption" color="text.secondary">
                                    {u.email}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </TableCell>
                          {!isMobile && (
                            <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                              {u.email}
                            </TableCell>
                          )}
                          <TableCell>
                            <Chip
                              label={u.role || "User"}
                              size="small"
                              color={u.role === "agent" ? "primary" : "default"}
                              sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                            />
                          </TableCell>
                          {!isMobile && (
                            <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                              {u.createdAt?.toDate?.().toLocaleDateString()}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>

          {/* Confirmation Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                m: { xs: 2, md: 3 },
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                fontWeight: 700,
                pb: 1,
              }}
            >
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
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  color: "text.secondary",
                }}
              >
                {selectedItem?.title || "No listing selected"}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                variant="contained"
                color={actionType === "approve" ? "success" : "error"}
                size={isMobile ? "small" : "medium"}
                sx={{ minWidth: 100 }}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
}