import React, { useEffect, useState } from "react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import newRequest from "../../utils/newRequest";
import exportToExcel from "../../utils/exportToExcel";

const DepartmentData = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newRequest.get("/api/v1/kpi/patient-counts");
         const colorMapping = {
           ACU: "#FF5733",
           "OB-GYNE": "#33FF57",
           PEDIAE: "#3357FF",
           OPTA: "#FF33A1",
           NEURO: "#33FFF6",
           GENERAL: "#FFC733",
           OR: "#C733FF",
           ICU: "#33FF91",
           TRIAGE: "#FF3333",
         };
        const apiData = response.data.data.departmentWise.map((department) => ({
          name: department.departmentName,
          value: department.patientCount,
          color: colorMapping[department.departmentCode] || "#CCCCCC",
        }));
        setDepartmentData(apiData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    try {
      setExporting(true);
      const rows = departmentData.map((department) => ({
        Department: department.name,
        "Patient Count": department.value,
      }));
      exportToExcel(rows, "clinic-assignment", "ClinicAssignment");
    } catch (error) {
      console.error("Failed to export department data", error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading data...</p>;
  }

  return (
    <div className="bg-green rounded-lg shadow-lg p-6 w-full max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Clinic Assignment
        </h2>
        <button
          onClick={handleExport}
          disabled={exporting || departmentData.length === 0}
          className="px-3 py-1 text-sm font-medium rounded-md bg-green-700 text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>
      <div className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={150}
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} patients`} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentData;
