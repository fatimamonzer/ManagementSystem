import http from "./http";

export async function fetchBookings() {
  const { data } = await http.get("/bookings");
  return data; // BookingDto[]
}

/** Fetch booking by ID */
export async function fetchBooking(id) {
  const { data } = await http.get(`/bookings/${id}`);
  return data;
}

export async function createBooking(payload) {
  const { data } = await http.post("/bookings", payload);
  return data; // BookingDto
}

export async function updateBooking(id, payload) {
  await http.put(`/bookings/${id}`, payload);
  return true;
}

export async function deleteBooking(id) {
  await http.delete(`/bookings/${id}`);
  return true;
}

export async function isRoomAvailable(roomId, startTime, endTime) {
  const { data } = await http.get(`/bookings/room/${roomId}/available`, {
    params: { start: startTime, end: endTime }
  });
  return data; // boolean
}
