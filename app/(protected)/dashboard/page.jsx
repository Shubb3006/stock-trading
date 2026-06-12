"use client";
import PortfolioChart from "@/app/components/Portfolio";
import DashboardSkeleton from "@/app/components/skeletons/DashboardSkeleton";
import { useHoldingStore } from "@/store/useHoldingStore";
import { useStockStore } from "@/store/useStockStore";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const page = () => {
  const { holdings, getHoldings, isFetchingHoldings } = useHoldingStore();
  const { getStocks, refreshStocks, stocks } = useStockStore();

  const getLivePrice = (stockId) => {
    const liveStock = stocks.find((s) => s._id === stockId);
    return liveStock?.currentPrice || 0;
  };
  useEffect(() => {
    if (holdings.length === 0) getHoldings();
  }, [getHoldings]);

  useEffect(() => {
    getStocks();

    const interval = setInterval(() => {
      refreshStocks();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [getStocks, refreshStocks]);

  const investedAmount = holdings.reduce(
    (acc, h) => acc + h.quantity * h.averageBuyPrice,
    0
  );

  const currentValue = holdings.reduce(
    (acc, h) => acc + h.quantity * getLivePrice(h.stockId._id),
    0
  );

  const pnl = currentValue - investedAmount;
  const percentage = investedAmount > 0 ? (pnl / investedAmount) * 100 : 0;

  if (isFetchingHoldings) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">My Portfolio</h1>
          <p className="text-base-content/70 mt-2">
            Track your investments and performance.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p className="text-base-content/60">Invested Amount</p>
              <h2 className="text-3xl font-bold">
                ₹{investedAmount.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p className="text-base-content/60">Current Value</p>
              <h2 className="text-3xl font-bold">
                ₹{currentValue.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p className="text-base-content/60">Profit / Loss</p>

              <h2
                className={`text-3xl font-bold ${
                  pnl >= 0 ? "text-success" : "text-error"
                }`}
              >
                {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString()} (
                {percentage.toFixed(2)}%)
              </h2>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Your Holdings</h2>

            {holdings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg font-semibold">No holdings yet</p>
                <p className="text-base-content/60">
                  Buy stocks to start building your portfolio.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Quantity</th>
                      <th>Avg Price</th>
                      <th>Current Price</th>
                      <th>P/L</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {holdings.map((holding) => {
                      const stockPnl =
                        (getLivePrice(holding.stockId._id) -
                          holding.averageBuyPrice) *
                        holding.quantity;

                      const stockPercentage =
                        ((getLivePrice(holding.stockId._id) -
                          holding.averageBuyPrice) /
                          holding.averageBuyPrice) *
                        100;

                      return (
                        <tr key={holding._id}>
                          <td>
                            <div>
                              <p className="font-bold">
                                {holding.stockId.symbol}
                              </p>
                              <p className="text-sm opacity-60">
                                {holding.stockId.name}
                              </p>
                            </div>
                          </td>

                          <td>{holding.quantity}</td>

                          <td>₹{holding.averageBuyPrice.toLocaleString()}</td>

                          <td>
                            ₹
                            {getLivePrice(holding.stockId._id).toLocaleString()}
                          </td>

                          <td
                            className={
                              stockPnl >= 0
                                ? "text-success font-semibold"
                                : "text-error font-semibold"
                            }
                          >
                            {stockPnl >= 0 ? "+" : ""}₹{stockPnl.toFixed(2)}(
                            {stockPercentage.toFixed(2)}%)
                          </td>
                          <td>
                            <Link
                              href={`stocks/${holding.stockId.symbol}`}
                              className="btn btn-primary"
                            >
                              {" "}
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
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
