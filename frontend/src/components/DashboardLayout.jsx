import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { evaluateFarmer } from '../services/api';
import DecisionCard from './DecisionCard';
import TrustGraph from './TrustGraph';

const DashboardLayout = () => {
  const [phoneNumber, setPhoneNumber] = useState('+254712345678');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setIsEvaluating(true);
    setError('');
    
    try {
      const result = await evaluateFarmer(phoneNumber);
      setData(result);
    } catch (err) {
      setError('Failed to evaluate farmer. Please check the backend connection.');
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold tracking-wider">
              KR
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">KREDO</h1>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              PROTOTYPE
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Farmer Evaluation</h2>
          <p className="text-gray-500">Analyze relationship-based credit risk for agricultural SACCOs.</p>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-8 max-w-2xl">
          <form onSubmit={handleEvaluate} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter farmer phone number (e.g., +254...)"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Evaluating...
                </>
              ) : (
                'Evaluate'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Graph</h3>
              <TrustGraph graphData={data?.graph} />
            </div>
          </div>
          <div className="space-y-6">
            <DecisionCard brief={data?.repayment_confidence_brief} isLoading={isEvaluating} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
