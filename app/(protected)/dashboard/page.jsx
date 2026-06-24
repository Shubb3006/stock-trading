"use client";
import DashboardSkeleton from "@/app/components/skeletons/DashboardSkeleton";
import { useHoldingStore } from "@/store/useHoldingStore";
import { useStockStore } from "@/store/useStockStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePortfolioStore } from "@/store/useProtfolioStore";
import PortfolioChart from "@/app/components/portfolio/PortfolioChart";
import { useAuthStore } from "@/store/useAuthStore";
import { useAiStore } from "@/store/useAiStore";
import { Loader, Loader2 } from "lucide-react";
import PortfolioAnalysis from "@/app/components/portfolio/PortfolioAnalysis";
import PortfolioChatResponse from "@/app/components/portfolio/PortfolioChat";
import { useTransactionsStore } from "@/store/useTransactionsStore";

const page = () => {
  const { holdings, getHoldings, isFetchingHoldings } = useHoldingStore();
  const { getStocks, refreshStocks, stocks } = useStockStore();
  const { portfolioHistory, getPortfolioHistory, createPortfolioSnapshot } =
    usePortfolioStore();
  const { portfolioAnalysis, analyzePortfolio, isAnalysingPortfolio } =
    useAiStore();
  const { authUser } = useAuthStore();

  const { getAllTransactions, transactions, isFetchingTransactions } =
    useTransactionsStore();

  const { aiChat, answer, isAnsweringQuestion } = useAiStore();
  const [question, setQuestion] = useState("");

  const getLivePrice = (stockId) => {
    const liveStock = stocks.find((s) => s._id === stockId);
    return liveStock?.currentPrice || 0;
  };
  useEffect(() => {
    if (holdings.length === 0) getHoldings();
    if (transactions.length === 0) getAllTransactions();
  }, [getHoldings, getAllTransactions]);

  useEffect(() => {
    async function loadData() {
      await createPortfolioSnapshot();
      await getPortfolioHistory();
    }

    loadData();
  }, []);

  useEffect(() => {
    getStocks();

    // const interval = setInterval(() => {
    //   refreshStocks();
    // }, 5000); // every 5 seconds

    // return () => clearInterval(interval);
  }, [getStocks, refreshStocks]);

  //total invested amount
  const investedAmount = holdings.reduce(
    (acc, h) => acc + h.quantity * h.averageBuyPrice,
    0
  );

  ///total holding value
  const holdingsValue = holdings.reduce(
    (acc, h) => acc + h.quantity * getLivePrice(h.stockId._id),
    0
  );

  //total profit/loss
  const pnl = holdingsValue - investedAmount;
  const percentage = investedAmount > 0 ? (pnl / investedAmount) * 100 : 0;

  //current holding + current cash
  const currentValue = holdingsValue + authUser?.cash;

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  const history24h = portfolioHistory.reduce((closest, current) => {
    const currentDiff = Math.abs(
      new Date(current.createdAt).getTime() - oneDayAgo
    );

    const closestDiff = closest
      ? Math.abs(new Date(closest.createdAt).getTime() - oneDayAgo)
      : Infinity;

    return currentDiff < closestDiff ? current : closest;
  }, null);

  const last24hTransactions = transactions.filter(
    (t) => new Date(t.createdAt).getTime() >= oneDayAgo
  );

  const deposits = last24hTransactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const withdrawals = last24hTransactions
    .filter((t) => t.type === "WITHDRAW")
    .reduce((sum, t) => sum + t.totalAmount, 0);

  // const oldValue = history24h?.totalValue + history24h?.cash || currentValue;
  const oldValue = history24h
    ? history24h.totalValue + (history24h.cash || 0)
    : currentValue;

  
  const dayPnl = currentValue - oldValue - deposits + withdrawals;

  const dayPnlPercent =
    investedAmount > 0 ? (dayPnl / investedAmount) * 100 : 0;
  if (isFetchingHoldings || isFetchingTransactions) {
    return <DashboardSkeleton />;
  }

  const chartData = portfolioHistory.map((item) => ({
    time: item.createdAt,
    invested: item.totalInvested,
    value: item.totalValue,
  }));
  // console.log(portfolioHistory);
  // console.log(chartData);

  console.log(portfolioAnalysis);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Portfolio</h1>
            <p className="text-base-content/70 mt-2">
              Track your investments and performance.
            </p>
          </div>

          <button
            className="btn btn-primary gap-2 shadow-lg hover:scale-105 transition-all duration-300"
            disabled={isAnalysingPortfolio}
            onClick={() =>
              analyzePortfolio({
                holdings,
                cash: authUser.cash,
                investedAmount,
                currentValue,
                pnl,
                dayPnl,
              })
            }
          >
            {isAnalysingPortfolio ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>🤖 AI Dashboard Analysis</>
            )}
          </button>
        </div>
        <PortfolioAnalysis analysis={portfolioAnalysis} />

        {chartData.length > 0 && <PortfolioChart data={chartData} />}

        <div className="card bg-base-100 shadow-xl border border-base-300 mb-10">
          <div className="card-body">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
                AI
              </div>

              <div>
                <h2 className="text-2xl font-bold">AI Portfolio Assistant</h2>

                <p className="text-base-content/60">
                  Ask questions about your portfolio, profits, risk,
                  allocations, and holdings.
                </p>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() =>
                  setQuestion("Which stock is generating the most profit?")
                }
              >
                Top Profit Stock
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() =>
                  setQuestion("What is the biggest risk in my portfolio?")
                }
              >
                Portfolio Risk
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setQuestion("Am I diversified enough?")}
              >
                Diversification
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setQuestion("Should I deploy my cash?")}
              >
                Cash Usage
              </button>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                aiChat({
                  question,
                  portfolio: {
                    holdings,
                    cash: authUser.cash,
                    investedAmount,
                    currentValue,
                    pnl,
                    dayPnl,
                  },
                });
              }}
              className="flex flex-col md:flex-row gap-3"
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Ask anything about your portfolio..."
              />

              <button
                disabled={isAnsweringQuestion || !question.trim()}
                className="btn btn-primary min-w-[120px]"
                type="submit"
              >
                {isAnsweringQuestion ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Thinking
                  </>
                ) : (
                  "Ask AI"
                )}
              </button>
            </form>

            {/* AI Response */}
            {answer && (
              <div className="mt-6">
                <PortfolioChatResponse response={answer} />
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
                ₹{holdingsValue.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p className="text-base-content/60">Total Returns</p>

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
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p className="text-base-content/60">1 Day Returns</p>

              <h2
                className={`text-3xl font-bold ${
                  dayPnl >= 0 ? "text-success" : "text-error"
                }`}
              >
                {dayPnl >= 0 ? "+" : ""}₹{dayPnl.toLocaleString()} (
                {dayPnlPercent.toFixed(2)}%)
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
