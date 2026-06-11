const StockDetailSkeleton = () => {
    return (
      <div className="min-h-[calc(100vh-64px)] max-w-6xl mx-auto px-4 py-10 animate-pulse">
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="h-12 w-40 bg-base-300 rounded mb-3"></div>
                <div className="h-6 w-64 bg-base-300 rounded mb-3"></div>
                <div className="h-6 w-24 bg-base-300 rounded"></div>
              </div>
  
              <div>
                <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
                <div className="h-10 w-40 bg-base-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card bg-base-100 shadow">
              <div className="card-body items-center">
                <div className="w-10 h-10 bg-base-300 rounded-full"></div>
                <div className="h-4 w-24 bg-base-300 rounded mt-3"></div>
                <div className="h-7 w-32 bg-base-300 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Position Card */}
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <div className="h-8 w-40 bg-base-300 rounded mb-6"></div>
  
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item}>
                  <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
                  <div className="h-6 w-20 bg-base-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* About + Trading */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* About */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="h-8 w-32 bg-base-300 rounded mb-4"></div>
  
              <div className="space-y-3">
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
  
          {/* Trade Card */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="h-8 w-32 bg-base-300 rounded mb-6"></div>
  
              <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
              <div className="h-12 w-full bg-base-300 rounded"></div>
  
              <div className="bg-base-200 rounded-lg p-4 mt-6">
                <div className="space-y-4">
                  <div className="h-4 bg-base-300 rounded"></div>
                  <div className="h-4 bg-base-300 rounded"></div>
                  <div className="h-px bg-base-300"></div>
                  <div className="h-6 bg-base-300 rounded"></div>
                </div>
              </div>
  
              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 bg-base-300 rounded"></div>
                <div className="h-12 flex-1 bg-base-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default StockDetailSkeleton;