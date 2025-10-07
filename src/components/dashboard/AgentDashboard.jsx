import { useState } from "react";
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
  IconButton,
  LinearProgress,
  alpha,
  Paper,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Add,
  Home,
  Visibility,
  TrendingUp,
  Message,
  Notifications,
  Settings,
  BarChart,
  CheckCircle,
  Schedule,
  Cancel,
  Edit,
  Star,
  Person,
  Email,
  Phone,
} from "@mui/icons-material";
import AddListingForm from "../agent/AddListingForm";
import AgentListings from "../agent/AgentsListing";
import Layout from "../layout/Layout";

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddListing, setShowAddListing] = useState(false);

  // Mock data - replace with real data from context/API
  const agentStats = {
    totalListings: 24,
    activeListings: 18,
    pendingApproval: 3,
    totalViews: 12450,
    thisMonthViews: 3240,
    inquiries: 156,
    newInquiries: 23,
    avgRating: 4.8,
    totalReviews: 89,
  };

  const recentActivity = [
    { type: "view", property: "Modern Apartment Kilimani", time: "2 hours ago" },
    { type: "inquiry", property: "Luxury Villa Karen", time: "5 hours ago" },
    { type: "approved", property: "Studio Flat Westlands", time: "1 day ago" },
    { type: "message", property: "Penthouse Lavington", time: "2 days ago" },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue !== 1) {
      setShowAddListing(false);
    }
  };

  return (
    <Layout>
    <Box sx={{ bgcolor: "#F3F3E0", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #183B4E 0%, #27548A 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              bgcolor: alpha("#DDA853", 0.2),
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#DDA853",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  JK
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    Welcome back, John Kamau
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 18 }} />}
                      label="Verified Agent"
                      sx={{
                        bgcolor: alpha("#DDA853", 0.2),
                        color: "white",
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: alpha("#DDA853", 0.3),
                      }}
                    />
                    <Chip
                      icon={<Star sx={{ fontSize: 18 }} />}
                      label={`${agentStats.avgRating} Rating`}
                      sx={{
                        bgcolor: alpha("#DDA853", 0.2),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <IconButton
                  sx={{
                    bgcolor: alpha("#fff", 0.15),
                    color: "white",
                    "&:hover": { bgcolor: alpha("#fff", 0.25) },
                  }}
                >
                  <Notifications />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: alpha("#fff", 0.15),
                    color: "white",
                    "&:hover": { bgcolor: alpha("#fff", 0.25) },
                  }}
                >
                  <Message />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: alpha("#fff", 0.15),
                    color: "white",
                    "&:hover": { bgcolor: alpha("#fff", 0.25) },
                  }}
                >
                  <Settings />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                  borderColor: "#27548A",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha("#27548A", 0.1),
                      color: "#27548A",
                    }}
                  >
                    <Home sx={{ fontSize: 32 }} />
                  </Box>
                  <Chip
                    label="+6 this month"
                    size="small"
                    sx={{
                      bgcolor: alpha("#27548A", 0.1),
                      color: "#27548A",
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <Typography variant="h3" fontWeight={800} color="#183B4E" gutterBottom>
                  {agentStats.activeListings}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Active Listings
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha("#27548A", 0.1),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#27548A",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    75% occupancy rate
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                  borderColor: "#DDA853",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha("#DDA853", 0.1),
                      color: "#DDA853",
                    }}
                  >
                    <Visibility sx={{ fontSize: 32 }} />
                  </Box>
                  <Chip
                    label="+26% vs last month"
                    size="small"
                    sx={{
                      bgcolor: alpha("#DDA853", 0.1),
                      color: "#DDA853",
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <Typography variant="h3" fontWeight={800} color="#183B4E" gutterBottom>
                  {agentStats.thisMonthViews.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Total Views This Month
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  {agentStats.totalViews.toLocaleString()} all-time views
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                  borderColor: "#183B4E",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha("#183B4E", 0.1),
                      color: "#183B4E",
                    }}
                  >
                    <Message sx={{ fontSize: 32 }} />
                  </Box>
                  <Chip
                    label={`${agentStats.newInquiries} new`}
                    size="small"
                    sx={{
                      bgcolor: alpha("#183B4E", 0.1),
                      color: "#183B4E",
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <Typography variant="h3" fontWeight={800} color="#183B4E" gutterBottom>
                  {agentStats.inquiries}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Total Inquiries
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  85% response rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                  borderColor: "#27548A",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha("#27548A", 0.1),
                      color: "#27548A",
                    }}
                  >
                    <Schedule sx={{ fontSize: 32 }} />
                  </Box>
                  <Chip
                    label="Pending"
                    size="small"
                    sx={{
                      bgcolor: alpha("#DDA853", 0.15),
                      color: "#DDA853",
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <Typography variant="h3" fontWeight={800} color="#183B4E" gutterBottom>
                  {agentStats.pendingApproval}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Pending Approval
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Avg. approval: 24 hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTab-root": {
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "none",
                      minHeight: 64,
                    },
                    "& .Mui-selected": {
                      color: "#27548A",
                    },
                  }}
                >
                  <Tab icon={<Dashboard />} iconPosition="start" label="Overview" />
                  <Tab icon={<Add />} iconPosition="start" label="Add Listing" />
                  <Tab icon={<Home />} iconPosition="start" label="My Listings" />
                  <Tab icon={<BarChart />} iconPosition="start" label="Analytics" />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <Box sx={{ p: 4, bgcolor: "white" }}>
                {activeTab === 0 && (
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h5" fontWeight={700} color="#183B4E">
                        Dashboard Overview
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                          setActiveTab(1);
                          setShowAddListing(true);
                        }}
                        sx={{
                          bgcolor: "#27548A",
                          fontWeight: 600,
                          px: 3,
                          "&:hover": { bgcolor: "#183B4E" },
                        }}
                      >
                        Add New Listing
                      </Button>
                    </Box>

                    <Typography variant="h6" fontWeight={700} color="#183B4E" gutterBottom>
                      Recent Activity
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {recentActivity.map((activity, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: alpha("#F3F3E0", 0.5),
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            border: "1px solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor:
                                activity.type === "approved"
                                  ? alpha("#27548A", 0.1)
                                  : activity.type === "inquiry"
                                  ? alpha("#DDA853", 0.1)
                                  : alpha("#183B4E", 0.1),
                              color:
                                activity.type === "approved"
                                  ? "#27548A"
                                  : activity.type === "inquiry"
                                  ? "#DDA853"
                                  : "#183B4E",
                            }}
                          >
                            {activity.type === "view" && <Visibility />}
                            {activity.type === "inquiry" && <Message />}
                            {activity.type === "approved" && <CheckCircle />}
                            {activity.type === "message" && <Email />}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight={600} color="#183B4E">
                              {activity.property}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="#183B4E" gutterBottom>
                      Add New Property Listing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Fill in the details below to list your property on Rentflow360
                    </Typography>
                    <AddListingForm />
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="#183B4E" gutterBottom>
                      My Property Listings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Manage and track all your property listings
                    </Typography>
                    <AgentListings />
                  </Box>
                )}

                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="#183B4E" gutterBottom>
                      Analytics & Performance
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Track your listing performance and engagement metrics
                    </Typography>
                    <Box
                      sx={{
                        p: 8,
                        textAlign: "center",
                        bgcolor: alpha("#F3F3E0", 0.3),
                        borderRadius: 2,
                      }}
                    >
                      <BarChart sx={{ fontSize: 80, color: "#27548A", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Analytics Dashboard Coming Soon
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="#183B4E" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    sx={{
                      justifyContent: "flex-start",
                      borderColor: "#27548A",
                      color: "#27548A",
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#183B4E",
                        bgcolor: alpha("#27548A", 0.05),
                      },
                    }}
                    onClick={() => {
                      setActiveTab(1);
                      setShowAddListing(true);
                    }}
                  >
                    Add New Listing
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{
                      justifyContent: "flex-start",
                      borderColor: "grey.300",
                      color: "text.secondary",
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#27548A",
                        color: "#27548A",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Message />}
                    sx={{
                      justifyContent: "flex-start",
                      borderColor: "grey.300",
                      color: "text.secondary",
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#27548A",
                        color: "#27548A",
                      },
                    }}
                  >
                    View Messages
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                background: `linear-gradient(135deg, ${alpha("#27548A", 0.05)} 0%, ${alpha(
                  "#DDA853",
                  0.05
                )} 100%)`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="#183B4E" gutterBottom>
                  This Month's Performance
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Profile Views
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="#27548A">
                        892
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={78}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha("#27548A", 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#27548A",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Response Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="#DDA853">
                        92%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha("#DDA853", 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#DDA853",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Conversion Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="#183B4E">
                        18%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={18}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha("#183B4E", 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#183B4E",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: alpha("#DDA853", 0.05),
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="#183B4E" gutterBottom>
                  💡 Pro Tips
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    • Add high-quality photos to increase views by 3x
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    • Respond to inquiries within 1 hour for better conversion
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    • Update your listings weekly to stay at the top
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </Layout>
  );
}