import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const LoadingSpinner = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: "#4361ee" }} />
      <Typography variant="body2" color="text.secondary">
        {message || "Loading notifications..."}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
