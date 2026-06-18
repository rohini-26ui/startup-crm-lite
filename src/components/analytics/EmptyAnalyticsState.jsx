import React from 'react';
import { BarChart3, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Shown when the CRM has no leads yet — prompts the user to add their first lead.
 */
const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      {/* Icon bubble */}
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-inner">
        <BarChart3 className="w-10 h-10 text-blue-400" />
      </div>

      {/* Copy */}
      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        No analytics available yet
      </h2>
      <p className="text-slate-500 text-sm text-center max-w-sm mb-8">
        Add your first lead to start tracking business performance, pipeline health,
        and revenue trends.
      </p>

      {/* CTA */}
      <button
        id="empty-analytics-add-lead"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
      >
        <PlusCircle className="w-4 h-4" />
        Add Lead
      </button>
    </div>
  );
};

export default EmptyAnalyticsState;
