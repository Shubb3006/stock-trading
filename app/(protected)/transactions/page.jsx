"use client";
import DashboardSkeleton from "@/app/components/skeletons/DashboardSkeleton";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import React, { useEffect, useMemo, useState } from "react";

const page = () => {
  const [filter, setFilter] = useState("ALL");
  const [range, setRange] = useState("1Y");

  const { getAllTransactions, transactions, isFetchingTransactions } =
    useTransactionsStore();
  useEffect(() => {
    getAllTransactions("ALL");
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date();
    return transactions.filter((item) => {
      let matchType = true;
      if (filter === "TRADES") {
        matchType = item.type === "BUY" || item.type === "SELL";
      } else if (filter === "CASH") {
        matchType = item.type === "DEPOSIT" || item.type === "WITHDRAW";
      }

      const date = new Date(item.createdAt);
      let matchesRange = true;
      switch (range) {
        case "1D":
          matchesRange = now - date <= 24 * 60 * 60 * 1000;
          break;

        case "5D":
          matchesRange = now - date <= 5 * 24 * 60 * 60 * 1000;
          break;

        case "1M":
          matchesRange = now - date <= 30 * 24 * 60 * 60 * 1000;
          break;

        case "1Y":
          matchesRange = now - date <= 365 * 24 * 60 * 60 * 1000;
          break;

        case "5Y":
          matchesRange = now - date <= 5 * 365 * 24 * 60 * 60 * 1000;
          break;

        default:
          matchesRange = true;
          break;
      }

      return matchType && matchesRange;
    });
  }, [transactions, range, filter]);

  const totalRealizedPL = filteredData
    .filter((t) => t.type === "SELL")
    .reduce((acc, t) => acc + (t.realizedPnl || 0), 0);

  const isInitialLoad = isFetchingTransactions && transactions.length === 0;

  if (isInitialLoad) return <DashboardSkeleton />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Transactions</h1>
            <p className="text-base-content/60 mt-1">
              View your complete trading and cash activity.
            </p>
          </div>

          <div className="flex flex-row gap-3 items-center ">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select select-bordered w-48"
            >
              <option value="ALL">All Activity</option>
              <option value="TRADES">Trades</option>
              <option value="CASH">Cash</option>
            </select>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="select select-bordered w-48"
            >
              <option value="ALL">All Time</option>
              <option value="5Y">5 Years</option>
              <option value="1Y">1 Year</option>
              <option value="1M">1 Month</option>
              <option value="5D">5 Days</option>
              <option value="1D">Today</option>
            </select>
          </div>
        </div>
        <div className="stats shadow bg-base-100 mb-8 w-full">
          <div className="stat">
            <div className="stat-title">Realized Profit/Loss</div>

            <div
              className={`stat-value text-3xl ${
                totalRealizedPL >= 0 ? "text-success" : "text-error"
              }`}
            >
              {totalRealizedPL >= 0 ? "+" : ""}₹
              {totalRealizedPL.toLocaleString()}
            </div>

            <div className="stat-desc">Based on filtered transactions</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body ">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="text-6xl">📄</div>

                <h2 className="text-2xl font-bold mt-4">
                  No Transactions Found
                </h2>

                <p className="text-base-content/60 mt-2">
                  Try changing your filters or start trading stocks.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border-base-300">
                <table className="table table-zebra">
                  <thead className="bg-base-200 z-10">
                    <tr>
                      <th>Type</th>
                      <th>Stock</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Realized P/L</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <span
                            className={`badge badge-lg ${
                              t.type === "BUY"
                                ? "badge-success"
                                : t.type === "SELL"
                                ? "badge-error"
                                : t.type === "DEPOSIT"
                                ? "badge-primary"
                                : "badge-warning"
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>

                        <td>
                          {t.stockId ? (
                            <div>
                              <p className="font-bold">{t.stockId?.symbol}</p>
                              <p className="text-xs opacity-70">
                                {t.stockId.name}
                              </p>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>{t.quantity ?? "-"}</td>
                        <td className="text-right">
                          {t.type === "SELL" || t.type === "BUY"
                            ? (t?.price || 0).toLocaleString()
                            : "-"}
                        </td>
                        <td className="font-semibold">
                          ₹{(t?.totalAmount || 0).toLocaleString()}
                        </td>
                        <td>
                          {t.type === "SELL" ? (
                            <span
                              className={
                                t.realizedPnl >= 0
                                  ? "text-success font-bold"
                                  : "text-error font-bold"
                              }
                            >
                              {t.realizedPnl >= 0 ? "+" : ""}₹
                              {t.realizedPnl.toLocaleString()}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        {/* <td>
                            {new Date(t.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td> */}
                        <td>{new Date(t.createdAt).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
