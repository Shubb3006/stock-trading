"use client";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

const page = () => {
  const { getAllTransactions, transactions, isFetchingTransactions } =
    useTransactionsStore();
  useEffect(() => {
    getAllTransactions();
  }, []);
  console.log(transactions);
  const totalRealizedPL = transactions
    .filter((t) => t.type === "SELL")
    .reduce((acc, t) => acc + (t.realizedPnl || 0), 0);
  console.log(totalRealizedPL);
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-4xl font-bold">My Transactions</h1>
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
        {isFetchingTransactions ? (
          <div className="min-h-[calc(100vh-300px)] flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {transactions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg font-semibold">No Transactions Yet</p>
                  <p className="opacity-70">
                    Buy or sell stocks to see your trading history.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                      {transactions.map((t) => (
                        <tr key={t._id}>
                          <td>
                            <span
                              className={`badge ${
                                t.type === "BUY"
                                  ? "badge-success"
                                  : "badge-error"
                              }`}
                            >
                              {t.type}
                            </span>
                          </td>

                          <td>
                            <div>
                              <p className="font-bold">{t.stockId.symbol}</p>
                              <p className="text-xs opacity-70">
                                {t.stockId.name}
                              </p>
                            </div>
                          </td>

                          <td>{t.quantity}</td>
                          <td>₹{t.price.toLocaleString()}</td>
                          <td>₹{t.totalAmount.toLocaleString()}</td>
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
                          <td>
                            {new Date(t.createdAt).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
