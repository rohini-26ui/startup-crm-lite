import React from 'react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title of the statistic.
 * @property {string|number} value - The main value to display.
 * @property {React.ElementType} icon - The Lucide React icon component to render.
 * @property {number} change - The percentage change compared to the previous period.
 * @property {string} color - The Tailwind color class prefix (e.g., 'blue', 'green').
 */

/**
 * A card component displaying a key statistic, an icon, and a percentage change.
 *
 * @param {StatsCardProps} props - The component props.
 * @returns {JSX.Element} The rendered StatsCard component.
 */
const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  const isPositive = change >= 0;
  
  // Tailwind doesn't support dynamic string interpolation for arbitrary colors perfectly out of the box 
  // without safelisting or using inline styles/specific classes if we just pass 'blue'.
  // However, assuming standard Tailwind colors, we can map them or just use them if they exist in the safelist.
  // To be safe and purely Tailwind, we'll map the `color` prop to specific classes or just use generic text-gray 
  // and color the icon container.
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-500',
    red: 'bg-red-100 text-red-500',
    purple: 'bg-purple-100 text-purple-600',
  };

  const iconClasses = colorMap[color] || 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg ${iconClasses}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <div className="flex items-center mt-2">
          <span 
            className={`text-sm font-medium flex items-center ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-slate-400 text-xs ml-2">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
