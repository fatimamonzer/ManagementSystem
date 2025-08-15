import React, { useEffect, useState } from "react";
import "./mom.css";
import { fetchAllMeetings, fetchMoMs, createMoM } from "../../services/momServices";

export default function MoM({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [moms, setMoms] = useState([]);
  const [form, setForm] = useState({
    meetingId: "",
    discussion: "",
    decisions: "",
    actionItems: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const meetingsData = await fetchAllMeetings();
        setMeetings(meetingsData);
        const momsData = await fetchMoMs();
        setMoms(momsData);
      } catch (err) {
        console.error(err);
        alert("Failed to load data from server");
      }
    };
    loadData();
  }, []);

  const addActionItem = () =>
    setForm((f) => ({
      ...f,
      actionItems: [...f.actionItems, { id: Date.now(), text: "", assignee: "", dueDate: "", done: false }],
    }));

  const updateActionItem = (id, patch) =>
    setForm((f) => ({
      ...f,
      actionItems: f.actionItems.map((ai) => (ai.id === id ? { ...ai, ...patch } : ai)),
    }));

  const removeActionItem = (id) =>
    setForm((f) => ({ ...f, actionItems: f.actionItems.filter((ai) => ai.id !== id) }));

  const handleSaveMoM = async () => {
    if (!form.meetingId) return alert("Select meeting.");
    try {
      const payload = {
        meetingId: form.meetingId,
        createdBy: user?.username || "Unknown",
        discussionPoints: form.discussion ? [form.discussion] : [],
        decisions: form.decisions ? [form.decisions] : [],
        actionItems: form.actionItems.map((ai) => ({ content: ai.text, assignedTo: ai.assignee })),
      };
      const newMoM = await createMoM(payload);
      setMoms((prev) => [newMoM, ...prev]);
      setForm({ meetingId: "", discussion: "", decisions: "", actionItems: [] });
      alert("MoM saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save MoM.");
    }
  };

  return (
    <div className="mom-page">
      <h1>Minutes of Meeting (MoM)</h1>

      <div className="mom-create">
        <label>Meeting</label>
        <select value={form.meetingId} onChange={(e) => setForm({ ...form, meetingId: e.target.value })}>
          <option value="">Select meeting</option>
          {meetings.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} — {new Date(m.createdAt).toLocaleDateString()}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Discussion points"
          value={form.discussion}
          onChange={(e) => setForm({ ...form, discussion: e.target.value })}
        />
        <textarea
          placeholder="Decisions"
          value={form.decisions}
          onChange={(e) => setForm({ ...form, decisions: e.target.value })}
        />

        <div className="action-items">
          <h4>Action Items</h4>
          {form.actionItems.map((ai) => (
            <div key={ai.id} className="action-row">
              <input placeholder="Action text" value={ai.text} onChange={(e) => updateActionItem(ai.id, { text: e.target.value })} />
              <input placeholder="Assignee" value={ai.assignee} onChange={(e) => updateActionItem(ai.id, { assignee: e.target.value })} />
              <input type="date" value={ai.dueDate} onChange={(e) => updateActionItem(ai.id, { dueDate: e.target.value })} />
              <button onClick={() => removeActionItem(ai.id)} className="btn-sm danger">Remove</button>
            </div>
          ))}
          <button onClick={addActionItem} className="btn-primary">Add action item</button>
        </div>

        <button onClick={handleSaveMoM} className="btn-primary" style={{ marginTop: 12 }}>Save MoM</button>
      </div>

      <h2>Saved MoMs</h2>
      {moms.length === 0 ? <p>No MoMs saved</p> : (
        <ul>
          {moms.map((m) => (
            <li key={m.id}>
              <strong>{m.title || "MoM"}</strong> — {new Date(m.createdAt).toLocaleString()} — created by {m.createdBy}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
