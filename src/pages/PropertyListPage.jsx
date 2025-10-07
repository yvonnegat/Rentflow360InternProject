import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import PropertyCard from "../components/properties/PropertyCard";
import { Box, Grid, Typography, Container, Skeleton, Fade, Alert } from "@mui/material";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import QuickSearch from "../components/home/QuickSearch";
import AdvancedSearch from "../components/home/AdvancedSearch";
import { filterProperties } from "../utils/searchUtils";
import SearchIcon from "@mui/icons-material/Search";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

function PropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userFavorites = user?.favorites || [];

  const [quickQuery, setQuickQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({});

  const handleQuickSearch = (query) => {
    setQuickQuery(query);
    setAdvancedFilters({});
  };

  const handleAdvancedSearch = (filters) => {
    setAdvancedFilters(filters);
    setQuickQuery("");
  };

  const filteredProperties = filterProperties(
    properties,
    quickQuery,
    advancedFilters
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "properties"),
          where("status", "==", "approved")
        );
        const snap = await getDocs(q);
        setProperties(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <HomeWorkIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
              >
                Find Your Perfect Home
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, mb: 4 }}>
                Discover {properties.length} premium properties across Kenya
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <QuickSearch onSearch={handleQuickSearch} />
          <Box sx={{ mt: 3 }}>
            <AdvancedSearch onSearch={handleAdvancedSearch} />
          </Box>
        </Box>

        {(quickQuery || Object.keys(advancedFilters).length > 0) && (
          <Fade in>
            <Alert
              icon={<SearchIcon />}
              severity="info"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {quickQuery && (
                <Typography variant="body2">
                  Searching for: <strong>"{quickQuery}"</strong>
                </Typography>
              )}
              {Object.keys(advancedFilters).length > 0 && (
                <Typography variant="body2">
                  {Object.keys(advancedFilters).length} advanced filter(s) active
                </Typography>
              )}
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Showing {filteredProperties.length} result(s)
              </Typography>
            </Alert>
          </Fade>
        )}

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2, mb: 1 }} />
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ minHeight: "400px" }}>
            {filteredProperties.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProperties.map((property, index) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Fade in timeout={300 + index * 100}>
                      <Box>
                        <PropertyCard
                          property={property}
                          userFavorites={userFavorites}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Fade in>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    px: 3,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 3,
                  }}
                >
                  <SearchIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    No Properties Found
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    We couldn't find any properties matching your search criteria.
                  </Typography>
                  {quickQuery && (
                    <Box
                      sx={{
                        backgroundColor: "white",
                        p: 3,
                        borderRadius: 2,
                        maxWidth: 500,
                        mx: "auto",
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        Try these examples:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • "1-bedroom Kasarani"
                        <br />
                        • "apartment westlands"
                        <br />• "house with parking"
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        )}
      </Container>

      <Box sx={{ pb: 6 }} />
    </Layout>
  );
}

export default PropertyListPage;