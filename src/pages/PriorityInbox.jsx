import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationCard from "../components/NotificationCard";
import TypeFilterBar from "../components/TypeFilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchNotifications } from "../utils/apiService";
import { getTopNPriority } from "../utils/priorityEngine";
import { getReadIds, markAsRead } from "../utils/readTracker";
import mockData from "../data/mockData";

// Top N options user can choose
const N_OPTIONS = [10, 15, 20, 25];

// Auto-refresh every 30 seconds to catch new notifications
const REFRESH_INTERVAL = 30000;

const PriorityInbox = () => {
  const [allNotifs, setAllNotifs] = useState([]);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [readIds, setReadIds] = useState(getReadIds());
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Fetch with API limit max of 10
      const params = { limit: 10 };
      if (filterType !== "All") {
        params.notification_type = filterType;
      }

      const data = await fetchNotifications(params);
      setAllNotifs(data);
      setUsingMock(false);
    } catch (err) {
      // Fallback: filter mock data by type if needed
      const filtered =
        filterType === "All"
          ? mockData
          : mockData.filter((n) => n.Type === filterType);

      setAllNotifs(filtered);
      setUsingMock(true);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [filterType]);

  // Load when filter changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      loadData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, [loadData]);

  const handleRead = (id) => {
    markAsRead(id);
    setReadIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
  };

  // Run priority scoring on the fetched notifications
  const prioritized = getTopNPriority(allNotifs, topN);
  const unreadCount = prioritized.filter((n) => !readIds.has(n.ID)).length;

  return (
    <Box
      sx={{
        maxWidth: 780,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: "#1a1a2e" }}>
            ⭐ Priority Inbox
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "All caught up"}{" "}
            {lastUpdated && `· Updated at ${lastUpdated}`}
          </Typography>
        </Box>

        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          disabled={loading}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Top N toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Show top:
        </Typography>

        <ToggleButtonGroup
          value={topN}
          exclusive
          onChange={(_, val) => {
            if (val !== null) setTopN(val);
          }}
          size="small"
          color="secondary"
        >
          {N_OPTIONS.map((n) => (
            <ToggleButton
              key={n}
              value={n}
              sx={{ px: 2, fontWeight: 600, fontSize: "0.82rem" }}
            >
              {n}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="caption" color="text.secondary">
          from {allNotifs.length} fetched
        </Typography>
      </Box>

      {/* Type filter chips */}
      <TypeFilterBar selected={filterType} onChange={setFilterType} />

      <Divider sx={{ mb: 2 }} />

      {/* Mock data warning */}
      {usingMock && (
        <Alert severity="warning" sx={{ mb: 2, fontSize: "0.82rem" }}>
          Could not reach server ({errorMsg}). Showing demo data.
        </Alert>
      )}

      {/* Notification cards */}
      {loading ? (
        <LoadingSpinner message="Calculating priorities..." />
      ) : prioritized.length === 0 ? (
        <Typography
          color="text.secondary"
          textAlign="center"
          py={8}
          fontSize="0.95rem"
        >
          No notifications match the selected filter.
        </Typography>
      ) : (
        prioritized.map((notif, index) => (
          <NotificationCard
            key={notif.ID}
            notification={notif}
            isRead={readIds.has(notif.ID)}
            onRead={handleRead}
            rank={index + 1}
          />
        ))
      )}
    </Box>
  );
};

export default PriorityInbox;
