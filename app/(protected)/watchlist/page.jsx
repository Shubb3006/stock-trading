"use client";

import StocksPageSkeleton from "@/app/components/skeletons/StockPageSkeleton";
import StockCard from "@/app/components/stocks/StockCard";
import StockSearch from "@/app/components/stocks/StockSearch";
import { useWatchListStore } from "@/store/useWatchListStore";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { watchList, getWatchList, isFetchingWatchList } = useWatchListStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (watchList.length === 0) getWatchList();
  }, [getWatchList]);

  const filteredStocks = watchList.filter(
    (stock) =>
      stock.stockId.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.stockId.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isFetchingWatchList) return <StocksPageSkeleton />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="mt-4 text-center mb-8">
        <h1 className="text-4xl font-bold">My Watchlist</h1>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStocks.map((stock) => (
              <StockCard key={stock._id} stock={stock.stockId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
