import React from 'react';

/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The lead status to display.
 */

/**
 * A pill-shaped colored badge representing a lead's status.
 *
 * @param {StatusBadgeProps} props - Component props.
 * @returns {JSX.Element} The rendered StatusBadge.
 */
const StatusBadge = ({ status }) => {
  // Define styles based on the status string
  let badgeStyle = "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ";

  switch (status) {
    case 'New':
      badgeStyle += "bg-gray-100 text-gray-700";
      break;
    case 'Contacted':
      badgeStyle += "bg-blue-100 text-blue-700";
      break;
    case 'Meeting Scheduled':
      badgeStyle += "bg-purple-100 text-purple-700";
      break;
    case 'Proposal Sent':
      badgeStyle += "bg-amber-100 text-amber-700";
      break;
    case 'Won':
      badgeStyle += "bg-green-100 text-green-700";
      break;
    case 'Lost':
      badgeStyle += "bg-red-100 text-red-700";
      break;
    default:
      badgeStyle += "bg-slate-100 text-slate-700";
  }

  return (
    <span className={badgeStyle}>
      {status}
    </span>
  );
};

export default StatusBadge;
