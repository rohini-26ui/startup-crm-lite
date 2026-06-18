import React from 'react';

/**
 * A pill-shaped colored badge representing a lead's status.
 *
 * @param {{ status: string }} props - Component props.
 * @returns {JSX.Element} The rendered StatusBadge.
 */
const StatusBadge = ({ status }) => {
  let badgeStyle = "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ";

  switch (status) {
    case 'New':
      badgeStyle += "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200";
      break;
    case 'Contacted':
      badgeStyle += "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      break;
    case 'Meeting Scheduled':
      badgeStyle += "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
      break;
    case 'Proposal Sent':
      badgeStyle += "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
      break;
    case 'Won':
      badgeStyle += "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      break;
    case 'Lost':
      badgeStyle += "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      break;
    default:
      badgeStyle += "bg-slate-100 text-slate-700 dark:bg-gray-600 dark:text-gray-200";
  }

  return (
    <span className={badgeStyle}>
      {status}
    </span>
  );
};

export default StatusBadge;
