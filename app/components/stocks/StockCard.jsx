import Link from "next/link";
import StockPrice from "./StockPrice";
import React from "react";
import { useStockStore } from "@/store/useStockStore";

const StockCard = ({ stock }) => {
  const {livePrices}=useStockStore();
  return (
    <Link href={`/stocks/${stock.symbol}`}>
      <div className="h-full card bg-base-100 shadow-md border hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="card-title text-xl">{stock.symbol}</h2>

              <p className="text-sm text-gray-500">{stock.name}</p>
            </div>

            <div className="badge badge-outline">{stock.sector}</div>
          </div>

          <div className="mt-4">
            <p className="">
              <StockPrice price={stock.currentPrice} />
              {/* {stock.currentPrice} */}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
