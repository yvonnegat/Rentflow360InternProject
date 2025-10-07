import { useState, useEffect } from "react";

import PropertyCard from "../properties/PropertyCard";
import { Box, Grid, Typography } from "@mui/material";
import { db } from "../../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import QuickSearch from "../home/QuickSearch";
import AdvancedSearch from "../home/AdvancedSearch";
import { filterProperties } from "../../utils/searchUtils";

function TrendingProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userFavorites = user?.favorites || [];

  const [quickQuery, setQuickQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({});

  // Called from QuickSearch
  const handleQuickSearch = (query) => {
    setQuickQuery(query);
    // Clear advanced filters when doing quick search
    setAdvancedFilters({});
  };

  // Called from AdvancedSearch
  const handleAdvancedSearch = (filters) => {
    setAdvancedFilters(filters);
    // Clear quick search when using advanced filters
    setQuickQuery("");
  };

  // Use the smart filtering function
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
    
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Browse Properties
        </Typography>

        {/* Quick and Advanced Search */}
        <QuickSearch onSearch={handleQuickSearch} />
        <Box sx={{ mt: 2 }}>
          <AdvancedSearch onSearch={handleAdvancedSearch} />
        </Box>

        {/* Active Search Indicator */}
        {(quickQuery || Object.keys(advancedFilters).length > 0) && (
          <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {quickQuery && `Searching for: "${quickQuery}"`}
              {Object.keys(advancedFilters).length > 0 &&
                " Using advanced filters"}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Typography align="center" sx={{ mt: 4 }}>
            Loading properties...
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard
                    property={property}
                    userFavorites={userFavorites}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center" sx={{ mt: 4, mb: 4 }}>
                  No properties found matching your search criteria.
                  {quickQuery && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Try: "1-bedroom Kasarani", "apartment westlands", "house
                        with parking"
                      </Typography>
                    </Box>
                  )}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

  );
}

export default TrendingProperties;