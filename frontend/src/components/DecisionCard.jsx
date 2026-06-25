import { ShieldAlert, ShieldCheck } from 'lucide-react';

const DecisionCard = ({ brief, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 min-h-[160px]">
        Search for a farmer to see the Repayment Confidence Brief.
      </div>
    );
  }

  // Simple heuristic for checking if it's positive or negative/unavailable
  const isPositive = !brief.toLowerCase().includes("unavailable") && !brief.toLowerCase().includes("error");

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        {isPositive ? (
          <ShieldCheck className="w-6 h-6 text-green-500" />
        ) : (
          <ShieldAlert className="w-6 h-6 text-amber-500" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">Repayment Confidence Brief</h3>
      </div>
      <div className="text-gray-700 leading-relaxed text-sm md:text-base bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        {brief}
      </div>
    </div>
  );
};

export default DecisionCard;
