import http from "./http";

/** DTO shapes are aligned with backend RoomDto/CreateRoomDto/UpdateRoomDto */

export async function fetchRooms() {
  const { data } = await http.get("/rooms");
  return data; // RoomDto[]
}

export async function fetchAvailableRooms() {
  const { data } = await http.get("/rooms/available");
  return data;
}

export async function createRoom(payload) {
  // payload: { name, capacity, location, features, isActive, isAvailable }
  const { data } = await http.post("/rooms", payload);
  return data; // created RoomDto
}

export async function updateRoom(id, payload) {
  await http.put(`/rooms/${id}`, payload);
  return true;
}

export async function deleteRoom(id) {
  await http.delete(`/rooms/${id}`);
  return true;
}
