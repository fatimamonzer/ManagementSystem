// src/components/ReportExport.js
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ReportExport({ data, filename = "report.xlsx" }) {
  // data: array of objects to export

  const exportToExcel = () => {
    // Create worksheet from JSON data
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Write workbook to binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create Blob from workbook output
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // Use FileSaver to save file on client
    saveAs(blob, filename);
  };

  return (
    <button onClick={exportToExcel} style={{ padding: "8px 16px", cursor: "pointer" }}>
      Export Report to Excel
    </button>
  );
}
