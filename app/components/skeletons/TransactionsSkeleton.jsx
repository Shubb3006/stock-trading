const TransactionSkeleton = () => {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-base-200">
        <div className="max-w-6xl mx-auto p-6 animate-pulse">
          
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <div className="h-10 w-64 bg-base-300 rounded mb-2"></div>
            </div>
  
            <div className="text-right">
              <div className="h-4 w-32 bg-base-300 rounded mb-2"></div>
              <div className="h-8 w-28 bg-base-300 rounded"></div>
            </div>
          </div>
  
          {/* Table Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Stock</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>P/L</th>
                      <th>Date</th>
                    </tr>
                  </thead>
  
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                      <tr key={row}>
                        <td>
                          <div className="h-6 w-16 bg-base-300 rounded-full"></div>
                        </td>
  
                        <td>
                          <div className="space-y-2">
                            <div className="h-4 w-16 bg-base-300 rounded"></div>
                            <div className="h-3 w-24 bg-base-300 rounded"></div>
                          </div>
                        </td>
  
                        <td>
                          <div className="h-4 w-10 bg-base-300 rounded"></div>
                        </td>
  
                        <td>
                          <div className="h-4 w-20 bg-base-300 rounded"></div>
                        </td>
  
                        <td>
                          <div className="h-4 w-24 bg-base-300 rounded"></div>
                        </td>
  
                        <td>
                          <div className="h-4 w-20 bg-base-300 rounded"></div>
                        </td>
  
                        <td>
                          <div className="h-4 w-28 bg-base-300 rounded"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default TransactionSkeleton;