// Priority scoring logic
// Placement > Result > Event based on weight
// Recency is used as a tiebreaker

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// Convert "2026-04-22 17:51:30" to milliseconds
const toMs = (timestamp) => {
  return new Date(timestamp.replace(" ", "T")).getTime();
};

export const getTopNPriority = (notifications, n) => {
  if (!notifications || notifications.length === 0) return [];

  const times = notifications.map((item) => toMs(item.Timestamp));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  const scored = notifications.map((item) => {
    const weight = TYPE_WEIGHT[item.Type] || 1;
    const recency =
      maxTime === minTime
        ? 1
        : (toMs(item.Timestamp) - minTime) / (maxTime - minTime);

    // Type weight is dominant, recency is the tiebreaker
    const score = weight * 10 + recency;

    return { ...item, _score: score, _weight: weight, _recency: recency };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, n);
};

export const formatTimestamp = (ts) => {
  const date = new Date(ts.replace(" ", "T"));
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
