// src/services/notificationService.js
const KEY = "notifications_v1";

/**
 * Notification shape:
 * {
 *   id: number,
 *   to: string, // username (for system-wide notifications, use "ALL" or "ROLE:Admin")
 *   type: "booking"|"meeting"|"system"|"action",
 *   title: string,
 *   body: string,
 *   data: any, // optional extra payload (e.g. { bookingId: 123 })
 *   read: boolean,
 *   createdAt: ISOString
 * }
 */

export function _loadAll() {
  const s = localStorage.getItem(KEY);
  return s ? JSON.parse(s) : [];
}

export function _saveAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addNotification({ to = "ALL", type = "system", title, body = "", data = null }) {
  const n = {
    id: Date.now() + Math.floor(Math.random() * 999),
    to,
    type,
    title,
    body,
    data,
    read: false,
    createdAt: new Date().toISOString()
  };
  const all = _loadAll();
  all.unshift(n); // newest first
  _saveAll(all);
  return n;
}

export function getNotificationsForUser(username) {
  const all = _loadAll();
  // return notifications where to === username OR to === "ALL" OR to is role-based "ROLE:Admin"
  return all.filter(n => {
    if (!username) return false;
    if (n.to === "ALL") return true;
    if (n.to === username) return true;
    if (n.to && n.to.startsWith("ROLE:")) {
      const role = n.to.split(":")[1];
      const userRole = getUserRole(username);
      return userRole === role;
    }
    return false;
  });
}

// helper to count unread for user
export function countUnread(username) {
  return getNotificationsForUser(username).filter(n => !n.read).length;
}

export function markRead(notificationId) {
  const all = _loadAll();
  const idx = all.findIndex(n => n.id === notificationId);
  if (idx === -1) return false;
  all[idx].read = true;
  _saveAll(all);
  return true;
}

export function markAllReadForUser(username) {
  const all = _loadAll();
  let changed = false;
  all.forEach(n => {
    if ((n.to === "ALL" || n.to === username || (n.to && n.to.startsWith("ROLE:"))) && !n.read) {
      // role match check
      if (n.to === username) { n.read = true; changed = true; }
      else if (n.to === "ALL") { n.read = true; changed = true; }
      else if (n.to.startsWith("ROLE:")) {
        const role = n.to.split(":")[1];
        const userRole = getUserRole(username);
        if (userRole === role) { n.read = true; changed = true; }
      }
    }
  });
  if (changed) _saveAll(all);
  return changed;
}

export function deleteNotification(id) {
  const all = _loadAll();
  const newAll = all.filter(n => n.id !== id);
  _saveAll(newAll);
  return true;
}

/* Light helper to fetch user's role from users list (localStorage). */
export function getUserRole(username) {
  const s = localStorage.getItem("users_v1");
  if (!s) return null;
  try {
    const users = JSON.parse(s);
    const u = users.find(x => x.username === username);
    return u ? u.role : null;
  } catch (e) {
    return null;
  }
}
