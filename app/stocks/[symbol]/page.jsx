"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useStockStore } from "@/store/useStockStore";
import StockDetail from "@/app/components/stocks/StockDetail";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { symbol } = useParams();

  const { getStockDetail, selectedStock, fetchingStockDetail } =
    useStockStore();

  useEffect(() => {
    if (symbol) {
      getStockDetail(symbol);
    }
  }, [symbol, getStockDetail]);

  if (fetchingStockDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm text-gray-500">Loading stock details...</p>
      </div>
    );
  }
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
