import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
// This is your chart library
import Reach from "./Reach";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const RevenueChart = () => {
  const [data, setData] = useState([]);
  // Stores formatted chart data
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("area");
// "area" → trend chart
// "bar" → monthly bars
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(`/api/admin/sales`);
        // Calls backend
        if (!response.ok) {
          throw new Error(`Failed to fetch revenue data`);
        }
        // Gets response data
        const result = await response.json();

        // Formats data for chart
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",

          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Loop through backend data
        const formattedData = result
          .map((item) => ({
            name: `${monthNames[item._id.month - 1]}  ${item._id.year}`,
//             Converts month number → name
//  Example: { month: 7, year: 2026 } → "Jul 2026"
            revenue: item.totalRevenue,
            // Extract revenue value
            fullDate: new Date(item._id.year, item._id.month - 1),
            // Creates actual Date object
          }))
          .sort((a, b) => a.fullDate - b.fullDate)
          // Sorts the array by date in ascending order (old → new)
          .slice(-12);
          // Takes last 12 elements from the array  count from the end

        setData(formattedData);
        // Updates state with formatted data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading)
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "cyan",
          textAlign: "center",
        }}
      >
        Loading revenue data...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "red",
          textAlign: "center",
        }}
      >
        Error: {error}
      </div>
    );

  return (
    <>
      <div
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "cyan",
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Monthly Revenue Overview
        </h2>

        {/* Chart Type Selector */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setActiveTab("area")}
            // Switch chart type
            style={{
              backgroundColor:
                activeTab === "area" ? "rgba(0, 255, 255, 0.2)" : "transparent",
              color: "cyan",
              border: "1px solid cyan",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Trend View
          </button>
          <button
            onClick={() => setActiveTab("bar")}
            style={{
              backgroundColor:
                activeTab === "bar" ? "rgba(0, 255, 255, 0.2)" : "transparent",
              color: "cyan",
              border: "1px solid cyan",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Monthly View
          </button>
        </div>

        <div style={{ height: "400px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "area" ? (
              <AreaChart data={data}>
                {/* Uses your formatted data */}
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  {/* Fancy visual effect */}
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <YAxis
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <Tooltip
                // Hover popup
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderColor: "cyan",
                    borderRadius: "5px",
                    color: "white",
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <YAxis
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderColor: "cyan",
                    borderRadius: "5px",
                  }}
                  labelStyle={{ color: "white" }}
                  itemStyle={{ color: "white" }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" name="Revenue">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          padding: "40px",
          marginTop: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Reach/> 
      </div>
    </>
  );
};

export default RevenueChart;

// Component loads
// useEffect runs
// API call → /api/admin/sales

// Backend returns:

// {
//   _id: { year: 2026, month: 7 },
//   totalRevenue: 50000
// }

// You transform it into:

// {
//   name: "Jul 2026",
//   revenue: 50000,
//   fullDate: Date(...)
// }
// Sort → keep last 12 months
// Store in state
// Render chart
// User switches chart type → UI updates