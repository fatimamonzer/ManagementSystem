// src/pages/Reports/index.js
import React from "react";
import ReportExport from "../../components/ReportExporter";

export default function Reports() {
  // Example dummy data (replace with real report data)
  const reportData = [
    { Meeting: "Weekly Sync", Date: "2025-08-12", Organizer: "Alice", Room: "Room A", Attendees: 10 },
    { Meeting: "Project Kickoff", Date: "2025-08-11", Organizer: "Bob", Room: "Room B", Attendees: 8 },
    { Meeting: "Design Review", Date: "2025-08-10", Organizer: "Carol", Room: "Room C", Attendees: 6 },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>Reports & Dashboard</h1>
      {/* Here you can add charts, summaries etc */}

      <div style={{ marginTop: 20 }}>
        <ReportExport data={reportData} filename="meeting_report.xlsx" />
      </div>
    </div>
  );
}
