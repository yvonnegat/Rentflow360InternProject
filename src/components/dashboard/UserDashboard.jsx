import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  alpha,
} from "@mui/material";
import {
  Favorite,
  Notifications,
  Chat,
  Report,
  Person,
  FavoriteBorder,
  NotificationsNone,
  ChatBubbleOutline,
  ReportProblemOutlined,
  PersonOutline,
  VisibilityOutlined,
  Visibility,
} from "@mui/icons-material";

import FavoritesPage from "../user/Favouritespage";
import AlertsPage from "../user/AlertsPage";
import ContactSellersPage from "../user/ContactSellerpage";
import ReportAdsPage from "../user/ReportAdsPage";
import UserProfilePage from "../user/UserProfilePage";
import ViewingsPage from "../user/ViewingPage";
import Layout from "../layout/Layout";

export default function UserDashboard() {
  const [activeView, setActiveView] = useState("favorites");

  // 🔹 Dashboard navigation items
  const navItems = [
    { id: "favorites", label: "Favorites", icon: FavoriteBorder, activeIcon: Favorite, color: "#e91e63", count: 12 },
    { id: "viewings", label: "Viewings", icon: VisibilityOutlined, activeIcon: Visibility, color: "#2196f3" }, // ✅ New
    { id: "alerts", label: "Alerts", icon: NotificationsNone, activeIcon: Notifications, color: "#ff9800", count: 3 },
    { id: "messages", label: "Messages", icon: ChatBubbleOutline, activeIcon: Chat, color: "#4caf50", count: 5 },
    { id: "reports", label: "Reports", icon: ReportProblemOutlined, activeIcon: Report, color: "#f44336" },
    { id: "profile", label: "Profile", icon: PersonOutline, activeIcon: Person, color: "#9c27b0" },
  ];

  // 🔹 View mapping
  const views = {
    favorites: <FavoritesPage />,
    viewings: <ViewingsPage />, // ✅ New
    alerts: <AlertsPage />,
    messages: <ContactSellersPage />,
    reports: <ReportAdsPage />,
    profile: <UserProfilePage />,
  };

  const activeItem = navItems.find((item) => item.id === activeView);

  return (
    <Layout>
      <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* 🔸 Navigation Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={2.4}
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Card
                    onClick={() => setActiveView(item.id)}
                    sx={{
                      cursor: "pointer",
                      width: { xs: "100%", sm: 150, md: "100%" },
                      border: isActive
                        ? `2px solid ${item.color}`
                        : "2px solid transparent",
                      bgcolor: isActive ? alpha(item.color, 0.05) : "#fff",
                      transition: "all 0.3s ease-in-out",
                      position: "relative",
                      overflow: "visible",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 24px ${alpha(item.color, 0.15)}`,
                        borderColor: item.color,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        py: 2.5,
                        px: 1,
                        position: "relative",
                      }}
                    >
                      {item.count && (
                        <Chip
                          label={item.count}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: item.color,
                            color: "#fff",
                            fontWeight: 600,
                            height: 22,
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                      <Icon
                        sx={{
                          fontSize: { xs: 28, sm: 32 },
                          color: isActive ? item.color : "#6c757d",
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? item.color : "#495057",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        {item.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* 🔸 Active View Section */}
          <Card
            sx={{
              borderTop: `4px solid ${activeItem.color}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              minHeight: { xs: "auto", md: 500 },
            }}
          >
            <Box
              sx={{
                bgcolor: alpha(activeItem.color, 0.05),
                borderBottom: "1px solid",
                borderColor: "divider",
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: alpha(activeItem.color, 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <activeItem.activeIcon
                    sx={{ color: activeItem.color, fontSize: 22 }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      color: "#212529",
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    {activeItem.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6c757d" }}>
                    Manage your {activeItem.label.toLowerCase()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {views[activeView]}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Layout>
  );
}
