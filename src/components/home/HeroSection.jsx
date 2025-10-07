import { Box, Container, Typography, Button, Grid, Chip, alpha } from "@mui/material";
import {
  Search,
  Shield,
  Star,
  Home as HomeIcon,
  Verified,
} from "@mui/icons-material";
import { keyframes } from "@mui/system";

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
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
        background: "linear-gradient(135deg, #183B4E 0%, #27548A 50%, #183B4E 100%)",
        color: "white",
        overflow: "hidden",
        minHeight: { xs: "90vh", md: "85vh" },
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Floating Background Blobs */}
      <Box sx={{
        position: "absolute", top: "-10%", left: "-5%",
        width: { xs: "300px", md: "400px" },
        height: { xs: "300px", md: "400px" },
        background: "radial-gradient(circle, rgba(221,168,83,0.15) 0%, transparent 70%)",
        borderRadius: "50%", animation: `${float} 6s ease-in-out infinite`, filter: "blur(40px)"
      }}/>
      <Box sx={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: { xs: "350px", md: "500px" },
        height: { xs: "350px", md: "500px" },
        background: "radial-gradient(circle, rgba(39,84,138,0.2) 0%, transparent 70%)",
        borderRadius: "50%", animation: `${float} 8s ease-in-out infinite`, animationDelay: "1s", filter: "blur(50px)"
      }}/>

      {/* Grid Pattern Overlay */}
      <Box sx={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: 0.3,
      }}/>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ animation: `${fadeInUp} 1s ease-out` }}>
              {/* Badge */}
              <Chip
                icon={<Verified sx={{ fontSize: 18 }} />}
                label="Kenya's #1 Real Estate Platform"
                sx={{
                  bgcolor: alpha("#DDA853", 0.2),
                  backdropFilter: "blur(10px)",
                  color: "#DDA853",
                  fontWeight: 700,
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  border: "1px solid",
                  borderColor: alpha("#DDA853", 0.3),
                  mb: 2,
                  px: 2,
                  py: 1.5,
                  height: "auto",
                }}
              />

              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", sm: "3rem", md: "4.5rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 2,
                  background: "linear-gradient(135deg, #ffffff 0%, #F3F3E0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Find Your Perfect
                <Box component="span" sx={{ display: "block", color: "#DDA853", mt: 1, fontSize: { xs: "2rem", sm: "3rem", md: "4.5rem" } }}>
                  Home in Nairobi
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                  mb: 4,
                  color: alpha("#ffffff", 0.85),
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: { xs: "100%", sm: "600px" },
                }}
              >
                Discover thousands of verified properties from trusted agents across Kenya.
                Your dream home is just a search away.
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Search />}
                  onClick={scrollToSearch}
                  sx={{
                    bgcolor: "#DDA853",
                    color: "white",
                    px: { xs: 0, sm: 4 },
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    boxShadow: `0 8px 24px ${alpha("#DDA853", 0.4)}`,
                    "&:hover": { bgcolor: "#c89642", transform: "translateY(-2px)", boxShadow: `0 12px 32px ${alpha("#DDA853", 0.5)}` },
                    transition: "all 0.3s ease",
                  }}
                >
                  Start Searching
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{
                    borderColor: alpha("#ffffff", 0.3),
                    color: "white",
                    px: { xs: 0, sm: 4 },
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: "none",
                    backdropFilter: "blur(10px)",
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": { borderColor: "#DDA853", bgcolor: alpha("#DDA853", 0.1), transform: "translateY(-2px)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  List Your Property
                </Button>
              </Box>

              {/* Trust Indicators */}
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Shield sx={{ color: "#DDA853", fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>100% Verified</Typography>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7) }}>All listings checked</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Star sx={{ color: "#DDA853", fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>4.9/5 Rating</Typography>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7) }}>From 10K+ reviews</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroSection;
