// Temporary mock authentication
const users = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "employee", password: "emp123", role: "Employee" },
  { username: "guest", password: "guest123", role: "Guest" }
];

export const loginUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};
