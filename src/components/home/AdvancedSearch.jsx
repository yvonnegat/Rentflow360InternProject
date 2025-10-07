import { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Collapse,
  IconButton,
  Chip,
  InputAdornment,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  FilterList,
  Search,
  LocationOn,
  Home,
  Bed,
  AttachMoney,
  Clear,
  ExpandMore,
  ExpandLess,
  Spa,
} from "@mui/icons-material";

function AdvancedSearch({ onSearch }) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    bedrooms: "",
    amenities: "",
  });
  const [priceRange, setPriceRange] = useState([0, 500000]);

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setFilters({
      ...filters,
      minPrice: newValue[0].toString(),
      maxPrice: newValue[1].toString(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      type: "",
      bedrooms: "",
      amenities: "",
    });
    setPriceRange([0, 500000]);
  };

  const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Townhouse", "Penthouse"];
  const bedroomOptions = ["1", "2", "3", "4", "5+"];
  const popularAmenities = ["Parking", "Security", "Gym", "Pool", "Garden", "Balcony"];
  const nairobiLocations = [
    "Kilimani","Karen","Westlands","Kileleshwa","Lavington","Parklands",
    "South B","South C","Ngong Road","Kasarani","Ruaka","Runda",
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #F3F3E0 100%)",
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: expanded ? 3 : 0,
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <FilterList sx={{ color: "#27548A" }} />
          <Typography variant="h6" fontWeight={700} color="#183B4E">
            Advanced Search
          </Typography>
          <Chip
            label="Find Your Perfect Home"
            size="small"
            sx={{ bgcolor: "#DDA853", color: "white", fontWeight: 600 }}
          />
        </Box>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{ bgcolor: "#27548A", color: "white", "&:hover": { bgcolor: "#183B4E" } }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Collapsible Form */}
      <Collapse in={expanded}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Location */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  label="Location"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: "#27548A" }} />
                    </InputAdornment>
                  }
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="">
                    <em>All Locations</em>
                  </MenuItem>
                  {nairobiLocations.map((loc) => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Property Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleChange}
                  label="Property Type"
                  startAdornment={
                    <InputAdornment position="start">
                      <Home sx={{ color: "#27548A" }} />
                    </InputAdornment>
                  }
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="">
                    <em>All Types</em>
                  </MenuItem>
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Bedrooms */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Bedrooms</InputLabel>
                <Select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleChange}
                  label="Bedrooms"
                  startAdornment={
                    <InputAdornment position="start">
                      <Bed sx={{ color: "#27548A" }} />
                    </InputAdornment>
                  }
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  {bedroomOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option} Bedroom{option !== "1" ? "s" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Amenities */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="amenities"
                label="Amenities"
                placeholder="e.g., Parking, Pool, Gym"
                value={filters.amenities}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Spa sx={{ color: "#27548A" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            {/* Popular Amenities Chips */}
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block", fontWeight: 600 }}>
                Popular Amenities:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {popularAmenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        amenities: filters.amenities
                          ? `${filters.amenities}, ${amenity}`
                          : amenity,
                      })
                    }
                    sx={{
                      bgcolor: filters.amenities.includes(amenity) ? "#27548A" : "#F3F3E0",
                      color: filters.amenities.includes(amenity) ? "white" : "#183B4E",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: filters.amenities.includes(amenity) ? "#183B4E" : "#DDA853",
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

            {/* Price Range */}
            <Grid item xs={12}>
              <Box sx={{ px: { xs: 0, sm: 2 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#183B4E">
                    <AttachMoney sx={{ verticalAlign: "middle", fontSize: 20 }} />
                    Price Range (KSh/month)
                  </Typography>
                  <Typography variant="body2" color="#27548A" fontWeight={600}>
                    {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                  </Typography>
                </Box>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500000}
                  step={10000}
                  sx={{
                    color: "#27548A",
                    "& .MuiSlider-thumb": { bgcolor: "#DDA853", border: "3px solid white", boxShadow: 2 },
                    "& .MuiSlider-track": { bgcolor: "#27548A" },
                    "& .MuiSlider-rail": { bgcolor: "#F3F3E0" },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">KSh 0</Typography>
                  <Typography variant="caption" color="text.secondary">KSh 500,000+</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleReset}
                  sx={{
                    borderColor: "#27548A",
                    color: "#27548A",
                    fontWeight: 600,
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": { borderColor: "#183B4E", bgcolor: "rgba(39,84,138,0.04)" },
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search />}
                  sx={{
                    bgcolor: "#27548A",
                    fontWeight: 600,
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": { bgcolor: "#183B4E" },
                  }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Collapse>
    </Paper>
  );
}

export default AdvancedSearch;
