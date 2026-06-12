import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ data, range }) {
  const isPositive = data[data.length - 1]?.price >= data[0]?.price;
  return (
    <div className="bg-base-100 rounded-xl p-4 shadow">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(time) => {
              const date = new Date(time);

              if (range === "1HR") {
                return date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }

              if (range === "1D") {
                return date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }

              if (range === "5D" || range === "1M") {
                return date.toLocaleDateString([], {
                  day: "numeric",
                  month: "short",
                });
              }

              return date.toLocaleDateString([], {
                month: "short",
                year: "2-digit",
              });
            }}
          />

          <YAxis domain={["dataMin", "dataMax"]} />

          <Tooltip
            formatter={(value) => [`₹${value}`, "Price"]}
            labelFormatter={(time) =>
              new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#00B386" : "#EF4444"}
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
