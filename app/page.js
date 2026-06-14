"use client";

import { useStockStore } from "@/store/useStockStore";
import Link from "next/link";
import { useEffect } from "react";
import StockCard from "./components/stocks/StockCard";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWatchListStore } from "@/store/useWatchListStore";

export default function Home() {
  const { getStocks, stocks,fetchingStocks,refreshStocks } = useStockStore();
  const {watchList,getWatchList}=useWatchListStore();

  const {authUser}=useAuthStore();

  useEffect(()=>{getWatchList()},[]);
  console.log(watchList)
 useEffect(() => {
  if(stocks.length===0)
    getStocks();

    const interval = setInterval(() => {
      refreshStocks();
    }, 1000); // every 5 seconds

    return () => clearInterval(interval);
  }, [getStocks,refreshStocks]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              TradeWise
            </h1>

            <p className="py-6 text-lg">
              Practice stock trading and track your
              portfolio with real-time insights.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/stocks"
                className="btn btn-primary"
              >
                Explore Stocks
              </Link>

              {authUser ? <Link
                href="/dashboard"
                className="btn btn-outline"
              >
                Dashboard
              </Link> :<Link
                href="/signup"
                className="btn btn-outline"
              >
                Get Started
              </Link>}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Stocks */}
      <section className="bg-base-100 mx-auto px-4 py-12">
        <h2 className="text-center text-3xl font-bold mb-6">
          Trending Stocks
        </h2>
        {fetchingStocks ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-gray-500">Fetching stocks...</p>
        </div>
      ) : stocks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium">No stocks found</p>
          <p className="text-gray-500">Try another search term.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto  grid justify-center md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stocks.slice(0,8).map((stock) => (
            <StockCard key={stock._id} stock={stock} />
          ))}
        </div>
      )}
        
      </section>

      {/* Features */}
      <section className="bg-base-200 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why TradeWise?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">
                  Search Stocks
                </h3>
                <p>
                  Explore stocks and view details.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">
                  Portfolio Tracking
                </h3>
                <p>
                  Track your investments and returns.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">
                  Paper Trading
                </h3>
                <p>
                  Practice trading without risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}