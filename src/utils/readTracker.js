// Tracks read/unread notifications using localStorage
// so the state survives page refreshes

const STORAGE_KEY = "campus_read_ids";

export const getReadIds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

export const markAsRead = (id) => {
  const current = getReadIds();
  current.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
};

export const markAllAsRead = (ids) => {
  const current = getReadIds();
  ids.forEach((id) => current.add(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
};
