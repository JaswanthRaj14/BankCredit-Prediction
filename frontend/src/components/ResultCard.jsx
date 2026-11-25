import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/**
 * Displays the prediction result returned by the API.
 * @param {{ result: { prediction: number, credit_history: string, bad_credit_probability: number, model?: string } | null, loading: boolean }} props
 */
export default function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[320px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Processing prediction…</p>
        <p className="text-xs text-gray-400 mt-1">Sending data to the ML model</p>
      </div>
    );
  }

  if (!result) return null;

  const isGood = result.prediction === 0;
  const badProb = result.bad_credit_probability;
  const goodProb = +(1 - badProb).toFixed(4);

  const chartData = [
    { name: 'Good Credit', value: goodProb },
    { name: 'Bad Credit', value: badProb },
  ];

  const COLORS = isGood ? ['#10b981', '#e5e7eb'] : ['#e5e7eb', '#ef4444'];

  return (
    <div className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden ${
      isGood ? 'border-emerald-200' : 'border-red-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 ${isGood ? 'bg-emerald-50' : 'bg-red-50'}`}>
        <div className="flex items-center gap-3">
          {isGood ? (
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-red-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Prediction Result</h3>
            <p className={`text-sm font-medium ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.credit_history}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Probabilities */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Predicted Class</p>
              <p className="text-2xl font-bold text-gray-900">{result.prediction}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Classification</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isGood
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.credit_history}
              </span>
            </div>

            {result.model && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Model</p>
                <p className="text-sm font-medium text-gray-700">{result.model}</p>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Good Credit Probability</span>
                  <span className="font-semibold text-emerald-600">{(goodProb * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goodProb * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Bad Credit Probability</span>
                  <span className="font-semibold text-red-600">{(badProb * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${badProb * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Good
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Bad
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Disclaimer:</strong> These probabilities are model estimates from an educational ML project.
            This is not a real lending decision and should not be used for actual credit approvals.
          </p>
        </div>
      </div>
    </div>
  );
}
