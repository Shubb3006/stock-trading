// components/stocks/StockPrice.jsx

import React from "react";

const StockPrice = ({ price }) => {
  return <span className="text-2xl font-bold">₹{price.toFixed(2)}</span>;
};

export default StockPrice;
