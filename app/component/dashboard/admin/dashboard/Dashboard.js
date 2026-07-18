import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// This is your charting library
// BarChart → main wrapper
// Bar → actual bars
// Cell → individual bar customization
// XAxis, YAxis → axes
// Tooltip → hover info
// ResponsiveContainer → makes chart responsive
import { motion } from "framer-motion";
// Used for animation
// Vibrant color palette
const colors = [
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#F97316",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#EF4444",
  "#14B8A6",
  "#F43F5E",
];

const getPath = (x, y, width, height) => {
  // This function creates an SVG path string
  // `M${x},${y + height}M = Move to starting pointStarts at bottom-left of the bar
  //C${x + width / 3},${y + height}
//  ${x + width / 2},${y + height / 3} You're shaping the left side curve of triangle
// ${x + width / 2}, ${y}This is the top peak of the triangle
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
//     M → move to start point
// C → curve (Bezier curve)
// Z → close shape
// this defines the bar shape
  }
  ${x + width / 2}, ${y}
 
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
  // Second curve → right side of triangle
  // ${x + width}, ${y + height}Ends at bottom-right corner
};

// Chart library calculates bar position & size
// Calls your TriangleBar
// TriangleBar calls getPath()
// getPath() returns SVG instructions
// <motion.path> draws that shape
// Framer Motion animates it

const TriangleBar = (props) => {
  const { fill, x, y, width, height, isActive } = props;
  // These are automatically passed by the chart:

  // fill → color of the bar
  // x → starting X position
  // y → starting Y position
  // width → width of the bar
  // height → height of the bar
  // isActive → whether the bar is hovered / active
  return (
    <motion.path
      d={getPath(x, y, width, height)}
      // defines the visual shape of the bar.
      stroke="none"
      fill={fill}
//       No border (stroke)
// Fill color comes from data/
      initial={{ opacity: 0, scaleY: 0 }}
      // grow-from-bottom effect
      animate={{
        opacity: 1,
        scaleY: 1,
        fill: isActive ? `${fill}FF` : `${fill}CC`,
        // Animation State
      }}
      transition={{ duration: 0.5, type: "spring" }}
      // natural bounce effect
      style={{
        filter: isActive ? `drop-shadow(0 0 8px ${fill})` : "none",
//         When active: Adds glow (drop-shadow)
// When not: No effect
      }}
    />
  );
};

// active → whether tooltip is visible
// payload → data of hovered bar
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
//         Startsinvisible
// slightly below (y: 20)
// Moves up + fades in Smooth entry effect.
        className="custom-tooltip"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: `2px solid ${payload[0].payload.color}`,
          backdropFilter: "blur(4px)",
        }}
//         Semi-transparent white background
// Rounded corners
// Shadow → depth
// Border color = bar color
// backdropFilter: blur → glassmorphism effect
      >
        <p
          style={{
            margin: 0,
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          {payload[0].payload.monthYear}
        </p>
        <p
          style={{
            margin: 0,
            color: payload[0].payload.color,
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {payload[0].value.toLocaleString()} users
          {/* toLocaleString() → formats number (e.g., 10000 → 10,000) */}
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function ModernTriangleChart() {
  const [data, setData] = useState([]);

  const [activeIndex, setActiveIndex] = useState(null);
  // Tracks hovered / selected bar index.
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyUrses = async () => {
      try {
        const response = await fetch(`/api/admin/dashboard`);
        // Calls backend API.
        if (!response.ok) {
          throw new Error("failed to  fetch user data");
        }

        const result = await response.json();
        // Converts response into JS object/array.
        const dataWithColors = result.map((item, index) => ({
          ...item,
          color: colors[index % colors.length],
        }));
        // Loops through API dataAdds color field to each item
        // index % colors.lengthCycles through colors array

        setData(dataWithColors);
        // Saves processed data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyUrses();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <p style={{ color: "white" }}>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        background: "#000",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "white",
              marginBottom: "4px",
            }}
          >
            Monthly User Growth
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            User registrations by month
          </p>
        </div>
      </div>

      <div style={{ height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            // Passes fetched data
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 80,
            }}
            // Spacing around chart
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
            // When mouse moves:Gets hovered bar indexUpdates activeIndex
            onMouseLeave={() => setActiveIndex(null)}
            // Reset when mouse leaves chart
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              // Uses name field from data
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "#64748b", fontSize: 14 }}
              tickMargin={15}
            />
            <YAxis
            // Formats numbers (10000 → 10,000)
              tick={{ fill: "#64748b", fontSize: 14 }}
              tickFormatter={(value) => value.toLocaleString()}
              width={60}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(226, 232, 240, 0.5)" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "30px",
                fontSize: "16px",
              }}
              formatter={(value) => (
                <span style={{ color: "#475569", fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="users" name="Total Users" shape={<TriangleBar />}>
            {/* dataKey="users" → reads users field */}
{/* shape → replaces default bar with your custom triangle */}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  isActive={activeIndex === index}
                />
              ))}
              {/* Each bar gets:unique color active state */} 
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "white",
            marginBottom: "20px",
          }}
        >
          Monthly Data
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {data.map((month, index) => (
            // Loop through data again
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              onClick={() => setActiveIndex(index)}
              // Clicking card highlights corresponding bar
              style={{
                background: "#111",
                padding: "16px",
                borderRadius: "8px",
                borderLeft: `4px solid ${month.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                cursor: "pointer",
                opacity:
                  activeIndex === null || activeIndex === index ? 1 : 0.7,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "2px",
                    background: month.color,
                    marginRight: "10px",
                    transform: "rotate(45deg)",
                  }}
                />
                <div
                  style={{
                    fontWeight: 600,
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  {month.name}
                </div>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: month.color,
                }}
              >
                {month.users.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component loads
// useEffect fires → API call
// Data comes back → enriched with colors
// Stored in data state
// Loading → false → component re-renders
// Chart renders using:
// Custom triangle bars
// Animated transitions
// Custom tooltip
// User hovers:
// Tooltip appears
// Bar glows + changes color