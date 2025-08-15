import http from "./http";

export async function fetchMeetings() {
  const { data } = await http.get("/meetings");
  return data;
}


/** Create a new meeting */
export async function createMeeting(payload) {
  const { data } = await http.post("/meetings", payload);
  return data;
}
