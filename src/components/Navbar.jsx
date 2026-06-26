import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOn = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#1a1a2e",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* Brand name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationsIcon sx={{ color: "#4361ee", fontSize: 26 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.5, fontSize: "1.1rem" }}
          >
            CampusNotify
          </Typography>
        </Box>

        {/* Nav buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => navigate("/")}
            startIcon={<NotificationsIcon />}
            sx={{
              color: "white",
              backgroundColor: isOn("/") ? "#4361ee" : "transparent",
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: isOn("/") ? "#3450d6" : "rgba(255,255,255,0.1)",
              },
            }}
          >
            All
          </Button>

          <Button
            onClick={() => navigate("/priority")}
            startIcon={<StarIcon />}
            sx={{
              color: "white",
              backgroundColor: isOn("/priority") ? "#4361ee" : "transparent",
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: isOn("/priority")
                  ? "#3450d6"
                  : "rgba(255,255,255,0.1)",
              },
            }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
