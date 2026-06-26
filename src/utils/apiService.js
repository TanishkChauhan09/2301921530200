const BASE_URL = "/api/evaluation-service/notifications";

export const fetchNotifications = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.limit) query.append("limit", params.limit);
  if (params.page) query.append("page", params.page);

  if (params.notification_type && params.notification_type !== "All") {
    query.append("notification_type", params.notification_type);
  }

  const url = query.toString()
    ? `${BASE_URL}?${query.toString()}`
    : BASE_URL;

  // Get token from environment variables
  const token = import.meta.env.VITE_API_TOKEN;

  const headers = {};

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("fetchNotifications", {
    url,
    tokenPresent: Boolean(token),
    tokenStart: token ? token.slice(0, 10) + "..." : null,
    headers,
  });

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error("fetchNotifications failed", {
      status: response.status,
      statusText: response.statusText,
      url,
    });
    throw new Error(`API error: status ${response.status}`);
  }

  const data = await response.json();
  return data.notifications || [];
};