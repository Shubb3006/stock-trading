import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-6xl mx-auto p-6 animate-pulse">

        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-base-300 rounded-lg mb-3"></div>
          <div className="h-4 w-80 bg-base-300 rounded"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="h-4 w-28 bg-base-300 rounded"></div>
                <div className="h-10 w-40 bg-base-300 rounded mt-3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Holdings Table */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="h-8 w-48 bg-base-300 rounded mb-6"></div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th>Quantity</th>
                    <th>Avg Price</th>
                    <th>Current Price</th>
                    <th>P/L</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
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
                        <div className="h-4 w-20 bg-base-300 rounded"></div>
                      </td>

                      <td>
                        <div className="h-4 w-24 bg-base-300 rounded"></div>
                      </td>

                      <td>
                        <div className="h-8 w-20 bg-base-300 rounded-lg"></div>
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

export default DashboardSkeleton;