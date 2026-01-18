import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import newRequest from "../../utils/newRequest";
import Spinner from "../../components/spinner/spinner";
import exportToExcel from "../../utils/exportToExcel";

const Patientsnumberchat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await newRequest.get(`/api/v1/kpi/registration-trend`);
      setData(response.data.data.trend);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleExport = () => {
    try {
      setExporting(true);
      const rows = data.map((item, index) => ({
        "#": index + 1,
        Date: item.date,
        "Patient Count": item.count,
      }));
      exportToExcel(rows, "registration-trend", "RegistrationTrend");
    } catch (error) {
      console.error("Failed to export registration trend", error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const months = data.map((item) => item.date);
  const patientCounts = data.map((item) => item.count);

  const chartSetting = {
    yAxis: [{ label: "No. of Patients" }],
  };

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Registration Trend</h2>
        <button
          onClick={handleExport}
          disabled={exporting || data.length === 0}
          className="px-3 py-1 text-sm font-medium rounded-md bg-white/20 hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>
      <div style={{ width: "100%", marginLeft: "20px" }}>
        {/* <h2 className="text-lg font-sans mt-5 ms-5 font-bold">Total Patients: {totalPatients}</h2> */}
        <BarChart
          height={350}
          xAxis={[{ scaleType: "band", data: months, label: "Date" }]}
          series={[
            {
              data: patientCounts,
              label: "Number of Patients for the last 7 days",
              barWidth: 20,
              color: "#1f1fff",
            },
          ]}
          barLabel="value"
          {...chartSetting}
        />
      </div>
    </div>
  );
};

export default Patientsnumberchat;
