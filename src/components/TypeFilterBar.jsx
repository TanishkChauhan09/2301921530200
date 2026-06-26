import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

const ALL_TYPES = ["All", "Placement", "Result", "Event"];

// Color for each type when selected
const selectedColor = {
  All: "default",
  Placement: "primary",
  Result: "secondary",
  Event: "success",
};

const TypeFilterBar = ({ selected, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
        Filter by type:
      </Typography>

      {ALL_TYPES.map((type) => (
        <Chip
          key={type}
          label={type}
          onClick={() => onChange(type)}
          color={selected === type ? selectedColor[type] : "default"}
          variant={selected === type ? "filled" : "outlined"}
          sx={{
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.78rem",
            transition: "all 0.2s ease",
          }}
        />
      ))}
    </Box>
  );
};

export default TypeFilterBar;
