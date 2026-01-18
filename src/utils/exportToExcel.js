import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

/**
 * Converts an array of objects to an Excel workbook and triggers download.
 * @param {Object[]} rows - Plain objects representing rows to export.
 * @param {string} fileName - Base name for the exported file.
 * @param {string} [sheetName="Sheet1"] - Worksheet name.
 */
const exportToExcel = (rows, fileName, sheetName = "Sheet1") => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const worksheet =
    safeRows.length > 0
      ? XLSX.utils.json_to_sheet(safeRows)
      : XLSX.utils.json_to_sheet([{}]); // ensure headers exist

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], { type: MIME });
  saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;

