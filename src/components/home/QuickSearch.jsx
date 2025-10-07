import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

function QuickSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  // Quick search examples
  const quickSearchExamples = [
    "1-bedroom Kasarani",
    "apartment westlands",
    "house with parking",
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      }}
    >
      {/* Search Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          placeholder='Search for "1-bedroom Kasarani" or "apartment westlands gym"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#27548A" }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={handleClear}
                  sx={{ minWidth: "auto", p: 0.5 }}
                >
                  <Clear fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#27548A",
              },
              "&:hover fieldset": {
                borderColor: "#183B4E",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "#27548A",
            fontWeight: 600,
            px: { xs: 2, sm: 4 },
            py: 1.5,
            width: { xs: "100%", sm: "auto" },
            boxShadow: 2,
            "&:hover": {
              bgcolor: "#183B4E",
              boxShadow: 4,
            },
          }}
        >
          Search
        </Button>
      </Box>

      {/* Quick search examples */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 2,
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {quickSearchExamples.map((example) => (
          <Chip
            key={example}
            label={example}
            size="small"
            onClick={() => {
              setQuery(example);
              onSearch(example);
            }}
            sx={{
              bgcolor: "#F3F3E0",
              color: "#183B4E",
              fontWeight: 500,
              fontSize: "0.75rem",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#DDA853",
                color: "white",
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}

export default QuickSearch;
