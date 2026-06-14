"use client";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PortfolioChart = ({ data }) => {
  const [range, setRange] = useState("1Y");
  
  const filteredData = useMemo(() => {
    const now = new Date();

    return data.filter((item) => {
      const date = new Date(item.time);

      switch (range) {
        case "1HR":
          return now - date <= 60 * 60 * 1000;
        case "1D":
          return now - date <= 24 * 60 * 60 * 1000;

        case "5D":
          return now - date <= 5 * 24 * 60 * 60 * 1000;

        case "1M":
          return now - date <= 30 * 24 * 60 * 60 * 1000;

        case "1Y":
          return now - date <= 365 * 24 * 60 * 60 * 1000;

        case "5Y":
          return now - date <= 5 * 365 * 24 * 60 * 60 * 1000;

        default:
          return true;
      }
    });
  }, [data, range]);

  return (
    <div className="card bg-base-100 shadow-lg mb-8">
      <div className="card-body">
        <h2 className="card-title text-2xl">Portfolio Performance</h2>
        <div className="flex mt-2 justify-between gap-8 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-base-content"></div>
              <span className="text-sm opacity-70">Invested</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-base-content"></div>
              <span className="text-sm opacity-70">Current Value</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-4 mb-2">
          <div className="flex gap-2">
            {["1HR", "1D", "5D", "1M", "1Y", "5Y"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`btn btn-sm ${
                  range === r ? "btn-primary" : "btn-ghost"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={filteredData}>
            <Tooltip
              contentStyle={{
                backgroundColor: "#000000",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => `₹${Number(value).toLocaleString()}`}
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

            <XAxis
              hide
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
            <YAxis hide domain={["auto", "auto"]} />

            <Line
              type="monotone"
              dataKey="invested"
              name="Invested Amount"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="value"
              name="Current Value"
              stroke="currentColor"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioChart;
