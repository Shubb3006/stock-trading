"use client";
import { useStockStore } from "@/store/useStockStore";
import React, { useState } from "react";
import { useEffect } from "react";
import StockCard from "../components/stocks/StockCard";
import StockSearch from "../components/stocks/StockSearch";
import StocksPageSkeleton from "../components/skeletons/StockPageSkeleton";

const page = () => {
  const { stocks, fetchingStocks, getStocks, refreshStocks } = useStockStore();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (stocks.length === 0) getStocks();

    // const interval = setInterval(() => {
    //   refreshStocks();
    // }, 5000); // every 5 seconds

    // return () => clearInterval(interval);
  }, [getStocks, refreshStocks]);

  if (fetchingStocks && stocks.length === 0) {
    return <StocksPageSkeleton />;
  }

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="mt-4 text-center mb-8">
        <h1 className="text-4xl font-bold">Explore Stocks</h1>

        <p className="text-base-content/70 mt-2">
          Search stocks and build your portfolio
        </p>
      </div>
      <StockSearch search={search} setSearch={setSearch} />
      <div className="max-w-7xl bg-base-100 mx-auto px-4 py-12">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-medium">No stocks found</p>
            <p className="text-gray-500">Try another search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 m-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {filteredStocks.map((stock) => (
              <StockCard key={stock._id} stock={stock} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
