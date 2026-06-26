
import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationCard from "../components/NotificationCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchNotifications } from "../utils/apiService";
import { getReadIds, markAllAsRead } from "../utils/readTracker";
import mockData from "../data/mockData";

const PAGE_SIZE = 10;

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [readIds, setReadIds] = useState(getReadIds());

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await fetchNotifications({
        page: currentPage,
        limit: PAGE_SIZE,
      });
      setNotifications(data);
      setUsingMock(false);
    } catch (err) {
      // API failed — show sliced mock data for the current page
      const start = (currentPage - 1) * PAGE_SIZE;
      const sliced = mockData.slice(start, start + PAGE_SIZE);
      setNotifications(sliced);
      setUsingMock(true);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When user clicks a card, update local read state
  const handleRead = (id) => {
    setReadIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
  };

  const handleMarkAllRead = () => {
    const ids = notifications.map((n) => n.ID);
    markAllAsRead(ids);
    setReadIds(getReadIds());
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.ID)).length;

  // Estimate total pages (API doesn't return total count)
  const totalPages = usingMock ? Math.ceil(mockData.length / PAGE_SIZE) : 5;

  return (
    <Box
      sx={{
        maxWidth: 780,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
      }}
    >
      {/* Page header */}
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
            All Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All notifications read"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            variant="outlined"
            color="secondary"
          >
            Mark all read
          </Button>
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
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Warning when using mock data */}
      {usingMock && (
        <Alert severity="warning" sx={{ mb: 2, fontSize: "0.82rem" }}>
          Could not reach the server ({errorMsg}). Showing demo data.
        </Alert>
      )}

      {/* Main content */}
      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <Typography
          color="text.secondary"
          textAlign="center"
          py={8}
          fontSize="0.95rem"
        >
          No notifications to show.
        </Typography>
      ) : (
        notifications.map((notif) => (
          <NotificationCard
            key={notif.ID}
            notification={notif}
            isRead={readIds.has(notif.ID)}
            onRead={handleRead}
          />
        ))
      )}

      {/* Pagination */}
      {!loading && notifications.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, val) => setCurrentPage(val)}
            color="secondary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default AllNotifications;
