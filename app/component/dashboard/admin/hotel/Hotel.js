import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
// PieChart → container Pie → actual chart Sector → slice shape
// Cell → individual slice styling Tooltip → hover infoLegend → labels

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];
// Custom renderer when a slice is active
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  // Converts degrees → radians
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  // These come from Recharts cx, cy → center of chart
  // midAngle → angle of slice value → slice value percent → percentage
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  // Calculates direction of slice.
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  // Start point of line
  const mx = cx + (outerRadius + 40) * cos;
  const my = cy + (outerRadius + 40) * sin;
  // Middle point of line
  const ex = mx + (cos >= 0 ? 1 : -1) * 30;
  const ey = my;
  // End point
  const textAnchor = cos >= 0 ? "start" : "end";
  // Align text left/right depending on side

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        style={{ fontWeight: "bold", fontSize: "24px" }}
      >
        {/* Shows room type name in center */}
        {payload.name}
      </text>
      {/* Main slice (bigger) */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        // Enlarges active slice
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Outer ring */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 20}
        outerRadius={outerRadius + 35}
        // Decorative glow ring
        fill={fill}
      />
      {/* Draws connector line */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      {/* Dot at end */}
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 15}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
        style={{ fontSize: "16px" }}
      >{`Bookings: ${value}`}</text>
      {/* Booking value text */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 15}
        y={ey}
        dy={22}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: "14px" }}
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
        {/* Percentage text */}
      </text>
    </g>
  );
};

const HotelPieChart = () => {
  const [hotelData, setHotelData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(`/api/admin/hotel`);
        // Calls your backend API
        if (!response.ok) {
          throw new Error("failed to fetch room type");
        }

        const data = await response.json();
        // Get response data

        //         data.map((roomType) => (...))
        // data → this is an array (probably coming from API / DB)
        // .map() → loops through each item and creates a new array
        // roomType → each individual object inside data
        // name: roomType.name → copy the name from original object
        // value: 600 → hardcoded value (same for every item)
        const transformedData = data.map((roomType) => ({
          name: roomType.name,
          value: 600,
        }));

        setHotelData(transformedData);
        // You're updating state with transformed data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };


    fetchRoomTypes()
  }, []);
  // Updates active slice on hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          color: "white",
        }}
      >
        Loading hotel data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          color: "red",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        padding: "3rem",
        borderRadius: "20px",
        boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "2.5rem",
          fontSize: "2.5rem",
          fontWeight: "700",
          textShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
        }}
      >
        Room Type Distribution
      </h2>
      {/* Only show chart if data exists */}
      {hotelData.length > 0 ? (
        <div style={{ width: "100%", height: "600px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={hotelData}
                cx="50%"
                cy="50%"
                innerRadius={120}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                paddingAngle={2}
              >
                {/* dataKey="value" → uses your value
activeShape → custom highlight
onMouseEnter → interaction */}
                {hotelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#000"
                    strokeWidth={activeIndex === index ? 4 : 1.5}
                  />
                ))}
                {/* Assign colors to slices */}
              </Pie>

              {/* Custom tooltip display */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
                itemStyle={{ color: "white" }}
                formatter={(value, name, props) => [
                  <span
                    style={{
                      color: COLORS[props.payload.index % COLORS.length],
                      fontWeight: "bold",
                    }}
                  >
                    {value}
                  </span>,
                  <span style={{ fontWeight: "bold" }}>{name}</span>,
                  <span>{`${(props.payload.percent * 100).toFixed(2)}%`}</span>,
                ]}
              />
              {/* Custom legend display */}
              <Legend
                wrapperStyle={{
                  paddingTop: "30px",
                  color: "white",
                  fontSize: "16px",
                }}
                iconSize={20}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value, entry, index) => (
                  <span
                    style={{
                      color: "white",
                      marginLeft: "8px",
                      fontSize: "16px",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "white" }}>
          No room type data available
        </div>
      )}
    </div>
  );
};

export default HotelPieChart;

// Component loads
// useEffect → runs
// 2. Fetch API
// GET /api/admin/hotel
// 3. Backend returns data
// [
//   { name: "Deluxe" },
//   { name: "Standard" }
// ]
// 4. Transform data
// { name: "Deluxe", value: 600 }

// 👉 ❌ Fake value (problem)

// 5. Store in state
// setHotelData()
// 6. Render chart
// PieChart → Pie → Cells
// 7. User hovers
// onMouseEnter → setActiveIndex
// 8. Active slice expands
// renderActiveShape()