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

/** Create a new booking */
export async function createBooking(payload) {
  // payload: { roomId, startTime: ISOString, endTime: ISOString }
  const { data } = await http.post("/bookings", payload);
  return data; // BookingDto
}

/** Update a booking */
export async function updateBooking(id, payload) {
  // payload: { startTime: ISOString, endTime: ISOString }
  await http.put(`/bookings/${id}`, payload);
  return true;
}

/** Delete a booking */
export async function deleteBooking(id) {
  await http.delete(`/bookings/${id}`);
  return true;
}

/** Check if room is available */
export async function isRoomAvailable(roomId, startTime, endTime) {
  const { data } = await http.get(`/bookings/room/${roomId}/available`, {
    params: { start: startTime, end: endTime }
  });
  return data; // boolean
}
