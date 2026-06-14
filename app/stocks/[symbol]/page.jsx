"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useStockStore } from "@/store/useStockStore";
import StockDetail from "@/app/components/stocks/StockDetail";
import StockDetailSkeleton from "@/app/components/skeletons/StockDetailSkeleton";

export default function Page() {
  const { symbol } = useParams();

  const { getStockDetail, selectedStock, fetchingStockDetail } =
    useStockStore();

  useEffect(() => {
    if (symbol) {
      getStockDetail(symbol);
    }

    return () => {
      useStockStore.setState({
        selectedStock: null,
      });
    };
  }, [symbol]);
  if (fetchingStockDetail)
    return (
      <div className="bg-base-200">
        <StockDetailSkeleton />
      </div>
    );

  if (!selectedStock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Stock not found</p>
      </div>
    );
  }
  return (
    <div className="bg-base-200">
      <StockDetail stock={selectedStock} />
    </div>
  );
}
