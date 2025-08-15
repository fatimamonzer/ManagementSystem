import http from "./http";

/** Fetch all meetings */
export async function fetchAllMeetings() {
  const { data } = await http.get("/mom/meetings");
  return data;
}

/** Fetch all MoMs */
export async function fetchMoMs() {
  const { data } = await http.get("/mom");
  return data;
}

/** Create a new MoM */
export async function createMoM(payload) {
  const formData = new FormData();
  formData.append("MeetingId", payload.meetingId);
  formData.append("CreatedBy", payload.createdBy);

  payload.discussionPoints?.forEach((d) => formData.append("DiscussionPoints", d));
  payload.decisions?.forEach((d) => formData.append("Decisions", d));
  payload.actionItems?.forEach((ai) => formData.append("ActionItems", JSON.stringify(ai)));

  const { data } = await http.post("/mom", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
