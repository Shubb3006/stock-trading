import StockCardSkeleton from "./StockCardSkeleton";

const StocksPageSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="mt-4 text-center mb-8 animate-pulse">
        <div className="h-10 w-72 bg-base-300 rounded mx-auto"></div>
        <div className="h-4 w-80 bg-base-300 rounded mx-auto mt-3"></div>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8 px-4">
        <div className="h-12 bg-base-300 rounded-xl animate-pulse"></div>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <StockCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StocksPageSkeleton;
