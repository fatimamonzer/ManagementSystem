import http from "./http";

const AUTH_KEY = "auth_user_v1";
const TOKEN_KEY = "token";

/** Persist session */
function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getStoredUser() {
  const s = localStorage.getItem(AUTH_KEY);
  return s ? JSON.parse(s) : null;
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

/** Auth APIs */
export async function registerUser({ username, email, password, role = "Guest", phone }) {
  const { data } = await http.post("/users/register", { username, email, password, role, phone });
  // optional: auto-login? (not here)
  return data; // UserDto
}

export async function loginUser(usernameOrEmail, password) {
  const { data } = await http.post("/users/login", { usernameOrEmail, password });
  // data: { token, user }
  saveSession(data.token, data.user);
  return data.user; // UserDto
}

export async function getProfile() {
  const { data } = await http.get("/users/profile");
  return data; // UserDto
}

export async function updateProfile(id, payload) {
  await http.put(`/users/${id}`, payload); // NoContent
  // if user updated self, refresh local cached user
  if (getStoredUser()?.id === id) {
    const updated = await getProfile();
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
  }
  return true;
}

/** Admin APIs */
export async function getAllUsers() {
  const { data } = await http.get("/users");
  return data; // UserDto[]
}

export async function deleteUser(id) {
  await http.delete(`/users/${id}`);
  return true;
}

export async function resetAllPasswords() {
  const { data } = await http.post("/users/reset-passwords");
  return data; // { message }
}
