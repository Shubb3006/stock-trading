import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";

const StockAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-3xl">AI Stock Analysis</h2>

          <p className="text-xl">{analysis.summary}</p>
        </div>
      </div>

      {/* Top Cards */}

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Trend</div>
          <div
            className={`stat-value ${
              analysis.trend === "Bullish"
                ? " text-success "
                : analysis.trend === "Sideways"
                ? " text-warning "
                : " text-error "
            }`}
          >
            {analysis.trend}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Risk</div>
          <div
            className={`stat-value ${
              analysis.riskLevel === "Low"
                ? " text-success "
                : analysis.riskLevel === "Medium"
                ? " text-warning "
                : " text-error "
            }`}
          >
            {analysis.riskLevel}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Verdict</div>
          <div className="stat-value text-primary">{analysis.verdict}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Confidence</div>
          <div className={`stat-value text-success`}>
            {analysis.confidenceScore}
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-success" />
            <h3 className="text-2xl font-bold">Strengths</h3>
          </div>

          <ul className="space-y-2">
            {analysis.strengths?.map((item, idx) => (
              <li key={idx} className="bg-success/10 p-3 text-xl rounded-lg">
                {item.replace(/\*\*/g, "")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="text-error" />
            <h3 className="text-2xl font-bold">Weaknesses</h3>
          </div>

          <ul className="space-y-2">
            {analysis.weaknesses?.map((item, idx) => (
              <li key={idx} className="bg-error/10 p-3 rounded-lg text-xl">
                {item.replace(/\*\*/g, "")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-warning" />
            <h3 className="text-2xl font-bold">Key Observations</h3>
          </div>

          <ul className="space-y-2">
            {analysis.keyObservations?.map((item, idx) => (
              <li key={idx} className="bg-warning/10 p-3 rounded-lg text-xl">
                {item.replace(/\*\*/g, "")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;
