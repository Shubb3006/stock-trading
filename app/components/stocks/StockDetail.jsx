"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  IndianRupee,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";
import { useHoldingStore } from "@/store/useHoldingStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useStockStore } from "@/store/useStockStore";
import StockPrice from "./StockPrice";
import StockChart from "./StockChart";
import StockChartSkeleton from "../skeletons/StockChartSkeleton";
import { useWatchListStore } from "@/store/useWatchListStore";
import { usePathname } from "next/navigation";

const StockDetail = ({ stock }) => {
  const [range, setRange] = useState("1D");
  const pathname = usePathname();

  const [quantity, setQuantity] = useState(1);
  const {
    buyStock,
    isBuyingStock,
    isSellingStock,
    sellStock,
    holdings,
    getHoldings,
    clearHoldings,
  } = useHoldingStore();
  const {
    stocks,
    getStocks,
    refreshStocks,
    getPriceHistory,
    priceHistory,
    connectSocket,
    fetchingHistory,
    refreshPriceHistory,
    clearPriceHistory,
  } = useStockStore();
  const {
    getWatchList,
    watchList,
    addToWatchList,
    deleteFromWatchList,
    isFetchingWatchList,
    isAddingToWatchList,
    isDeletingFromWatchList,
  } = useWatchListStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser && watchList.length === 0) {
      getWatchList();
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      getHoldings();
    } else {
      clearHoldings();
    }
  }, [authUser, clearHoldings, getHoldings]);

  useEffect(() => {
    clearPriceHistory();

    getStocks();
    getPriceHistory(stock.symbol);
    // conxnectSocket(stock.symbol);

    const interval = setInterval(() => {
      // refreshStocks();
      refreshPriceHistory(stock.symbol);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [stock.symbol]);

  const isInWatchList = watchList.some((w) => {
    const id = w.stockId?._id || w.stockId;
    return id === stock._id;
  });

  const liveStock = stocks.find((s) => s._id === stock._id) || stock;

  const isHoldingThisStock = holdings.find(
    (h) => h.stockId._id.toString() === stock._id.toString()
  );

  const investedAmount = isHoldingThisStock
    ? isHoldingThisStock.quantity * isHoldingThisStock.averageBuyPrice
    : 0;

  const currentValue = isHoldingThisStock
    ? isHoldingThisStock.quantity * liveStock.currentPrice
    : 0;

  const pnl = currentValue - investedAmount;

  const totalCost = quantity * liveStock?.currentPrice;

  async function handleBuy() {
    await buyStock({ quantity, stockId: stock._id });
  }
  async function handleSell() {
    await sellStock({ quantity, stockId: stock._id });
  }

  // const chartData = priceHistory.map((item) => ({
  //   time: new Date(item.createdAt).toLocaleTimeString(),
  //   price: Number(item.price),
  // }));
  const chartData = priceHistory.map((item) => ({
    time: item.createdAt,
    price: Number(item.price),
  }));

  const filteredData = useMemo(() => {
    const now = new Date();

    return chartData.filter((item) => {
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
  }, [chartData, range]);

  async function toggleWishlist(stockId) {
    if (isInWatchList) {
      await deleteFromWatchList(stockId);
    } else {
      await addToWatchList({ stockId });
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div>
                <h1 className="text-5xl font-bold">{liveStock?.symbol}</h1>

                <p className="text-xl text-base-content/70 mt-2">
                  {liveStock?.name}
                </p>

                <div className="badge badge-primary mt-4">
                  {liveStock?.sector}
                </div>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="flex items-center gap-2 justify-end">
                <h2 className="text-4xl font-bold">
                  <StockPrice price={liveStock?.currentPrice} />
                </h2>
                {authUser && !isFetchingWatchList && (
                  <div
                    className="tooltip"
                    data-tip={
                      isInWatchList
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"
                    }
                  >
                    <button
                      className="btn btn-circle btn-sm cursor-pointer transition-transform duration-300 hover:scale-110"
                      disabled={isAddingToWatchList || isDeletingFromWatchList}
                      onClick={() => toggleWishlist(stock._id)}
                    >
                      {isAddingToWatchList || isDeletingFromWatchList ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Star
                          size={22}
                          className={
                            isInWatchList
                              ? "text-yellow-400"
                              : "text-base-content/40"
                          }
                          fill={`${isInWatchList ? "currentColor" : "none"}`}
                        />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-base-content/60">Current Price</p>
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

        {!fetchingHistory ? (
          <StockChart key={stock.symbol} data={filteredData} range={range} />
        ) : (
          <StockChartSkeleton />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow">
          <div className="card-body items-center text-center">
            <IndianRupee size={30} />
            <h3 className="font-semibold">Current Price</h3>
            <p className="text-2xl font-bold">
              ₹{liveStock?.currentPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body items-center text-center">
            <Building2 size={30} />
            <h3 className="font-semibold">Company</h3>
            <p>{stock?.name}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body items-center text-center">
            <TrendingUp size={30} />
            <h3 className="font-semibold">Sector</h3>
            <p>{liveStock?.sector}</p>
          </div>
        </div>
      </div>
      {authUser && isHoldingThisStock && (
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl">Your Position</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-70">Shares Owned</p>
                <p className="font-bold text-xl">
                  {isHoldingThisStock.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-70">Avg Buy Price</p>
                <p className="font-bold text-xl">
                  ₹{isHoldingThisStock.averageBuyPrice.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-70">Current Price</p>
                <p className="font-bold text-xl">
                  ₹{liveStock?.currentPrice.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-70">Invested</p>
                <p className="font-bold">₹{investedAmount.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm opacity-70">Current Value</p>
                <p className="font-bold">₹{currentValue.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm opacity-70">P/L</p>
                <p
                  className={`font-bold ${
                    pnl >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About + Buy */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* About */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-2xl">About</h2>

            <p className="text-base-content/70 leading-relaxed">
              {stock?.name} operates in the {stock?.sector} sector. This stock
              is available for paper trading within the platform. You can
              purchase shares and track your holdings through your portfolio.
            </p>
          </div>
        </div>

        {/* Buy Section */}
        {!authUser ? (
          <div className="card bg-base-100 shadow">
            <div className="card-body text-center">
              <h2 className="text-2xl font-bold">Start Trading</h2>

              <p className="text-base-content/70">
                Sign in to buy shares, track your portfolio and monitor profits.
              </p>

              <Link
                href={`/login?redirect=${pathname}`}
                className="btn btn-primary mt-4"
              >
                Login to Trade
              </Link>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title text-2xl">Buy Shares</h2>

              <div className="form-control flex gap-2">
                <label className="label">
                  <span className="label-text">Quantity : </span>
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input input-bordered"
                />
              </div>

              <div className="bg-base-200 rounded-lg p-4 mt-4">
                <div className="flex justify-between">
                  <span>Price per Share</span>
                  <span>₹{stock?.currentPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Cost</span>
                  <span>₹{totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="btn btn-primary flex-1"
                  onClick={handleBuy}
                  disabled={isBuyingStock || isSellingStock || quantity <= 0}
                >
                  {isBuyingStock ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Buy Stock"
                  )}
                </button>
                {isHoldingThisStock && (
                  <button
                    className="btn btn-error flex-1"
                    onClick={handleSell}
                    disabled={
                      isSellingStock ||
                      isBuyingStock ||
                      quantity <= 0 ||
                      quantity > isHoldingThisStock.quantity
                    }
                  >
                    {isSellingStock ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Sell Stock"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
