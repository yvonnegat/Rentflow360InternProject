import { Box, Container, Typography, Button, Grid, Chip, alpha, Stack, Paper } from "@mui/material";
import {
  Search,
  Shield,
  Star,
  Home as HomeIcon,
  Verified,
  TrendingUp,
  LocationOn,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import { keyframes } from "@mui/system";

// Enhanced animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

function HeroSection() {
  const scrollToSearch = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        color: "white",
        overflow: "hidden",
        minHeight: { xs: "95vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Animated Background Elements */}
      <Box sx={{
        position: "absolute",
        top: "-20%",
        left: "-10%",
        width: { xs: "400px", md: "600px" },
        height: { xs: "400px", md: "600px" },
        background: "radial-gradient(circle, rgba(255,159,64,0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: `${float} 8s ease-in-out infinite`,
        filter: "blur(60px)",
      }}/>
      
      <Box sx={{
        position: "absolute",
        top: "20%",
        right: "-5%",
        width: { xs: "300px", md: "450px" },
        height: { xs: "300px", md: "450px" },
        background: "radial-gradient(circle, rgba(75,192,192,0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: `${floatSlow} 10s ease-in-out infinite`,
        animationDelay: "2s",
        filter: "blur(60px)",
      }}/>

      <Box sx={{
        position: "absolute",
        bottom: "-15%",
        right: "10%",
        width: { xs: "350px", md: "500px" },
        height: { xs: "350px", md: "500px" },
        background: "radial-gradient(circle, rgba(153,102,255,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: `${float} 12s ease-in-out infinite`,
        animationDelay: "4s",
        filter: "blur(70px)",
      }}/>

      {/* Enhanced Grid Pattern */}
      <Box sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.5,
      }}/>

      {/* Diagonal Lines Decoration */}
      <Box sx={{
        position: "absolute",
        inset: 0,
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(255,255,255,0.01) 100px,
            rgba(255,255,255,0.01) 102px
          )
        `,
      }}/>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ animation: `${fadeInRight} 1s ease-out` }}>
              {/* Premium Badge */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<Verified sx={{ fontSize: 18 }} />}
                  label="Trusted by 50,000+ Users"
                  sx={{
                    bgcolor: alpha("#FF9F40", 0.15),
                    backdropFilter: "blur(20px)",
                    color: "#FF9F40",
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", md: "0.85rem" },
                    border: "1px solid",
                    borderColor: alpha("#FF9F40", 0.3),
                    px: 2,
                    py: 2,
                    height: "auto",
                    boxShadow: `0 4px 16px ${alpha("#FF9F40", 0.2)}`,
                  }}
                />
              </Box>

              {/* Main Heading with Gradient */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem", lg: "5.5rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 2,
                  letterSpacing: "-0.02em",
                }}
              >
                <Box component="span" sx={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                }}>
                  Discover Your
                </Box>
                <Box component="span" sx={{
                  background: "linear-gradient(135deg, #FF9F40 0%, #FFD700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                  mt: 1,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-10px",
                    left: 0,
                    width: { xs: "120px", md: "180px" },
                    height: "6px",
                    background: "linear-gradient(90deg, #FF9F40 0%, transparent 100%)",
                    borderRadius: "3px",
                  }
                }}>
                  Dream Home
                </Box>
              </Typography>

              {/* Enhanced Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.35rem" },
                  mb: 4,
                  mt: 4,
                  color: alpha("#ffffff", 0.85),
                  fontWeight: 400,
                  lineHeight: 1.7,
                  maxWidth: { xs: "100%", sm: "550px" },
                }}
              >
                Explore thousands of verified properties across Kenya. From modern apartments to luxury villas, find the perfect place to call home.
              </Typography>

              {/* Enhanced CTA Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={scrollToSearch}
                  sx={{
                    bgcolor: "#FF9F40",
                    color: "white",
                    px: 4,
                    py: 2,
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    boxShadow: `0 12px 32px ${alpha("#FF9F40", 0.4)}`,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      animation: `${shimmer} 3s infinite`,
                    },
                    "&:hover": {
                      bgcolor: "#e88f30",
                      transform: "translateY(-3px)",
                      boxShadow: `0 16px 40px ${alpha("#FF9F40", 0.5)}`,
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Browse Properties
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{
                    borderColor: alpha("#ffffff", 0.4),
                    borderWidth: 2,
                    color: "white",
                    px: 4,
                    py: 2,
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    backdropFilter: "blur(20px)",
                    bgcolor: alpha("#ffffff", 0.05),
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      borderColor: "#FF9F40",
                      bgcolor: alpha("#FF9F40", 0.15),
                      transform: "translateY(-3px)",
                      boxShadow: `0 8px 24px ${alpha("#FF9F40", 0.2)}`,
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  List Property
                </Button>
              </Stack>

              {/* Enhanced Stats Grid */}
              <Grid container spacing={3} sx={{ maxWidth: 600 }}>
                <Grid item xs={4}>
                  <Box sx={{ 
                    textAlign: "center",
                    animation: `${scaleIn} 0.6s ease-out 0.3s both`,
                  }}>
                    <Typography variant="h3" fontWeight="800" sx={{ 
                      background: "linear-gradient(135deg, #FF9F40 0%, #FFD700 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}>
                      5K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), fontWeight: 500 }}>
                      Properties
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ 
                    textAlign: "center",
                    animation: `${scaleIn} 0.6s ease-out 0.5s both`,
                  }}>
                    <Typography variant="h3" fontWeight="800" sx={{ 
                      background: "linear-gradient(135deg, #4BC0C0 0%, #6DD5ED 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}>
                      50K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), fontWeight: 500 }}>
                      Happy Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ 
                    textAlign: "center",
                    animation: `${scaleIn} 0.6s ease-out 0.7s both`,
                  }}>
                    <Typography variant="h3" fontWeight="800" sx={{ 
                      background: "linear-gradient(135deg, #9966FF 0%, #C084FC 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}>
                      500+
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), fontWeight: 500 }}>
                      Top Agents
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Content - Feature Cards */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: { xs: "none", md: "block" },
              animation: `${fadeInUp} 1s ease-out 0.3s both`,
            }}>
              <Stack spacing={3}>
                {/* Feature Card 1 */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: alpha("#ffffff", 0.08),
                    backdropFilter: "blur(20px)",
                    border: "1px solid",
                    borderColor: alpha("#ffffff", 0.1),
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    transition: "all 0.3s ease",
                    animation: `${float} 6s ease-in-out infinite`,
                    "&:hover": {
                      transform: "translateX(10px)",
                      bgcolor: alpha("#ffffff", 0.12),
                      borderColor: alpha("#FF9F40", 0.3),
                    },
                  }}
                >
                  <Box sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 3,
                    bgcolor: alpha("#FF9F40", 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Shield sx={{ fontSize: 36, color: "#FF9F40" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      100% Verified Listings
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), lineHeight: 1.6 }}>
                      Every property is thoroughly verified by our expert team
                    </Typography>
                  </Box>
                </Paper>

                {/* Feature Card 2 */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: alpha("#ffffff", 0.08),
                    backdropFilter: "blur(20px)",
                    border: "1px solid",
                    borderColor: alpha("#ffffff", 0.1),
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    transition: "all 0.3s ease",
                    animation: `${float} 6s ease-in-out infinite`,
                    animationDelay: "1s",
                    "&:hover": {
                      transform: "translateX(10px)",
                      bgcolor: alpha("#ffffff", 0.12),
                      borderColor: alpha("#4BC0C0", 0.3),
                    },
                  }}
                >
                  <Box sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 3,
                    bgcolor: alpha("#4BC0C0", 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <TrendingUp sx={{ fontSize: 36, color: "#4BC0C0" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      Best Market Prices
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), lineHeight: 1.6 }}>
                      Competitive pricing with transparent market analysis
                    </Typography>
                  </Box>
                </Paper>

                {/* Feature Card 3 */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: alpha("#ffffff", 0.08),
                    backdropFilter: "blur(20px)",
                    border: "1px solid",
                    borderColor: alpha("#ffffff", 0.1),
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    transition: "all 0.3s ease",
                    animation: `${float} 6s ease-in-out infinite`,
                    animationDelay: "2s",
                    "&:hover": {
                      transform: "translateX(10px)",
                      bgcolor: alpha("#ffffff", 0.12),
                      borderColor: alpha("#9966FF", 0.3),
                    },
                  }}
                >
                  <Box sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 3,
                    bgcolor: alpha("#9966FF", 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Star sx={{ fontSize: 36, color: "#9966FF" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      Premium Support
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), lineHeight: 1.6 }}>
                      24/7 customer service to assist you every step
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Trust Bar - Mobile Friendly */}
        <Box sx={{ 
          mt: { xs: 6, md: 10 },
          display: { xs: "none", sm: "flex" },
          justifyContent: "center",
          gap: 6,
          flexWrap: "wrap",
          animation: `${fadeInUp} 1s ease-out 0.8s both`,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircle sx={{ color: "#FF9F40", fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              No Hidden Fees
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircle sx={{ color: "#4BC0C0", fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Secure Payments
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircle sx={{ color: "#9966FF", fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Instant Booking
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <Box sx={{
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        animation: `${pulse} 2s ease-in-out infinite`,
        display: { xs: "none", md: "block" },
      }}>
        <Box sx={{
          width: 30,
          height: 50,
          border: "2px solid",
          borderColor: alpha("#ffffff", 0.3),
          borderRadius: 15,
          display: "flex",
          justifyContent: "center",
          pt: 1,
        }}>
          <Box sx={{
            width: 6,
            height: 10,
            bgcolor: "#FF9F40",
            borderRadius: 3,
            animation: `${fadeInUp} 1.5s ease-in-out infinite`,
          }}/>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;