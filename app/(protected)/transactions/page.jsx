"use client";
import DashboardSkeleton from "@/app/components/skeletons/DashboardSkeleton";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import React, { useEffect, useMemo, useState } from "react";

const page = () => {
  const [filter, setFilter] = useState("ALL");

  const { getAllTransactions, transactions, isFetchingTransactions } =
    useTransactionsStore();
  useEffect(() => {
    getAllTransactions("ALL");
  }, []);

  const totalRealizedPL = transactions
    .filter((t) => t.type === "SELL")
    .reduce((acc, t) => acc + (t.realizedPnl || 0), 0);

  const filteredTransactions = useMemo(() => {
    if (filter === "ALL") return transactions;
    if (filter === "CASH")
      return transactions.filter(
        (t) => t.type === "DEPOSIT" || t.type === "WITHDRAW"
      );
    if (filter === "TRADES")
      return transactions.filter((t) => t.type === "BUY" || t.type === "SELL");
  }, [transactions, filter]);

  const isInitialLoad = isFetchingTransactions && transactions.length === 0;

  if (isInitialLoad) return <DashboardSkeleton />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-4xl font-bold">My Transactions</h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="ALL">All</option>
            <option value="TRADES">Trades</option>
            <option value="CASH">Cash</option>
          </select>

          <div className="text-right">
            <p className="text-sm opacity-70">Total Realized P&L</p>
            <p
              className={`text-2xl font-bold ${
                totalRealizedPL >= 0 ? "text-success" : "text-error"
              }`}
            >
              {totalRealizedPL >= 0 ? "+" : ""}₹
              {totalRealizedPL.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body ">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg font-semibold">No Transactions Yet</p>
                <p className="opacity-70">
                  Buy or sell stocks to see your trading history.
                </p>
              </div>
            ) : (
              <div
                className={`isFiltering ? "opacity-60" : "" overflow-x-auto`}
              >
                <table className="table">
                  <thead>
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
                    {filteredTransactions.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <span
                            className={`badge ${
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
                        <td>
                          {t.type === "SELL" || t.type === "BUY"
                            ? (t?.totalAmount || 0).toLocaleString()
                            : "-"}
                        </td>
                        <td>₹{(t?.totalAmount || 0).toLocaleString()}</td>
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
