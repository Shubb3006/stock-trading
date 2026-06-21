import {
    TrendingUp,
    AlertTriangle,
    PieChart,
    MessageSquare,
  } from "lucide-react";
  
  const PortfolioChatResponse = ({ response }) => {
    if (!response) return null;
  
    const getTypeIcon = () => {
      switch (response.type) {
        case "profit":
          return <TrendingUp className="text-success" />;
        case "risk":
          return <AlertTriangle className="text-error" />;
        case "allocation":
          return <PieChart className="text-info" />;
        default:
          return <MessageSquare />;
      }
    };
  
    const getRiskBadge = () => {
      switch (response.riskLevel) {
        case "Low":
          return "badge-success";
        case "Medium":
          return "badge-warning";
        case "High":
          return "badge-error";
        default:
          return "badge-neutral";
      }
    };
  
    return (
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              {getTypeIcon()}
            </div>
  
            <div>
              <h2 className="text-xl font-bold">
                AI Portfolio Assistant
              </h2>
  
              <div className={`badge ${getRiskBadge()}`}>
                Risk: {response.riskLevel}
              </div>
            </div>
          </div>
  
          {/* Main Answer */}
          <div className="bg-base-200 rounded-xl p-4">
            <p className="text-lg leading-relaxed">
              {response.answer}
            </p>
          </div>
  
          {/* Action Items */}
          {response.actionItems?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">
                Recommended Actions
              </h3>
  
              <div className="space-y-2">
                {response.actionItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-success/10 rounded-lg p-3"
                  >
                    ✅ {item}
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Related Stocks */}
          {response.relatedStocks?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">
                Related Holdings
              </h3>
  
              <div className="flex flex-wrap gap-2">
                {response.relatedStocks.map((stock, index) => (
                  <div
                    key={index}
                    className="badge badge-outline badge-lg"
                  >
                    {stock}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default PortfolioChatResponse;