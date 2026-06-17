import { IndianRupee } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ data, range }) {
  const startPrice = data[0]?.price;
  const endPrice = data[data.length - 1]?.price;
  const totalChange = endPrice - startPrice;
  let percentage =
    startPrice && endPrice ? Math.abs((totalChange / startPrice) * 100) : 0;
  const isPositive = totalChange > 0;
  if (!isPositive) percentage = -percentage;
  return (
    <div className="bg-base-100 rounded-xl p-4 shadow">
      <div className="text-right mb-3">
        <div
          className={`font-bold flex items-center justify-end gap-1 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <IndianRupee size={16} />
          <span>
            {isPositive ? "+" : ""}
            {totalChange.toFixed(2)}({isPositive ? "+" : ""}
            {percentage.toFixed(2)}%)
          </span>
        </div>
      </div>
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

          <YAxis
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value) => [`₹${value}`, "Price"]}
            labelFormatter={(time) => {
              const date = new Date(time);

              if (range === "1HR" || range === "1D") {
                return date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }

              if (range === "5D" || range === "1M") {
                return date.toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                });
              }

              // 🔥 1Y / 5Y case
              return date.toLocaleDateString([], {
                year: "numeric",
                day: "numeric",
                month: "short",
              });
            }}
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
