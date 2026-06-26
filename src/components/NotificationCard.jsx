import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import CircleIcon from "@mui/icons-material/Circle";
import { formatTimestamp } from "../utils/priorityEngine";
import { markAsRead } from "../utils/readTracker";

// Visual config for each notification type
const typeConfig = {
  Placement: {
    icon: <WorkIcon sx={{ fontSize: 14 }} />,
    chipColor: "primary",
    borderColor: "#1565c0",
    unreadBg: "#eef4ff",
  },
  Result: {
    icon: <SchoolIcon sx={{ fontSize: 14 }} />,
    chipColor: "secondary",
    borderColor: "#6a1b9a",
    unreadBg: "#faf0ff",
  },
  Event: {
    icon: <EventIcon sx={{ fontSize: 14 }} />,
    chipColor: "success",
    borderColor: "#2e7d32",
    unreadBg: "#f0faf0",
  },
};

const NotificationCard = ({ notification, isRead, onRead, rank }) => {
  const config = typeConfig[notification.Type] || typeConfig.Event;

  const handleClick = () => {
    if (!isRead) {
      markAsRead(notification.ID);
      onRead(notification.ID);
    }
  };

  return (
    <Card
      onClick={handleClick}
      elevation={isRead ? 1 : 3}
      sx={{
        borderLeft: `5px solid ${config.borderColor}`,
        mb: 1.5,
        cursor: isRead ? "default" : "pointer",
        backgroundColor: isRead ? "#ffffff" : config.unreadBg,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ py: "12px !important", px: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>

          {/* Rank number shown on Priority page only */}
          {rank !== undefined && (
            <Typography
              sx={{
                color: "#bbb",
                fontWeight: 800,
                fontSize: "1.1rem",
                minWidth: 30,
                pt: 0.2,
              }}
            >
              #{rank}
            </Typography>
          )}

          <Box sx={{ flex: 1 }}>
            {/* Top row: chip + unread dot + time */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                mb: 0.8,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  icon={config.icon}
                  label={notification.Type}
                  color={config.chipColor}
                  size="small"
                  sx={{ fontSize: "0.7rem", height: 22 }}
                />
                {/* Blue dot for unread */}
                {!isRead && (
                  <Tooltip title="New — click to mark as read">
                    <CircleIcon sx={{ color: "#4361ee", fontSize: 9 }} />
                  </Tooltip>
                )}
              </Box>

              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(notification.Timestamp)}
              </Typography>
            </Box>

            {/* Message text */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: isRead ? 400 : 600,
                color: isRead ? "#666" : "#1a1a2e",
                textTransform: "capitalize",
                mb: 0.5,
              }}
            >
              {notification.Message}
            </Typography>

            {/* Read status hint */}
            <Typography
              variant="caption"
              sx={{ color: isRead ? "#bbb" : "#4361ee" }}
            >
              {isRead ? "Read" : "Tap to mark as read"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
