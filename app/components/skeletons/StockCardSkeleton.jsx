const StockCardSkeleton = () => {
    return (
      <div className="card bg-base-100 shadow-lg animate-pulse">
        <div className="card-body">
          <div className="h-6 w-20 bg-base-300 rounded"></div>
  
          <div className="h-4 w-36 bg-base-300 rounded mt-2"></div>
  
          <div className="h-8 w-24 bg-base-300 rounded mt-4"></div>
  
          <div className="h-10 w-full bg-base-300 rounded-lg mt-4"></div>
        </div>
      </div>
    );
  };
  
  export default StockCardSkeleton;