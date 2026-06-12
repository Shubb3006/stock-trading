const StockChartSkeleton = () => {
    return (
      <div className="bg-base-100 rounded-xl p-4 shadow animate-pulse">
        {/* Price */}
        <div className="h-8 w-40 bg-base-300 rounded mb-2"></div>
  
        {/* Change */}
        <div className="h-4 w-24 bg-base-300 rounded mb-6"></div>
  
        {/* Chart */}
        <div className="h-[350px] w-full bg-base-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-base-300/50 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
  
        {/* Range buttons */}
        <div className="flex justify-end gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-8 w-12 bg-base-300 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default StockChartSkeleton;