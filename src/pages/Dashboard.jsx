import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeads } from '../context/LeadContext';

import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import AddLeadModal from '../components/dashboard/AddLeadModal';

/**
 * The main Dashboard page component that assembles all dashboard widgets.
 * Uses a responsive grid layout to present key metrics, pipeline status, 
 * recent leads, and quick actions.
 *
 * @returns {JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  const { leads, addLead } = useLeads();
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Dynamic stats calculation based on current leads state
  const totalLeads = leads.length;
  // Calculate total value of all deals
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  // Format total value (e.g. 1500000 -> $1.5M or just formatted number)
  const formattedTotalValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue);

  // In a real app, this would come from an API
  const statsData = [
    { title: 'Total Leads', value: totalLeads.toString(), icon: Users, change: 12.5, color: 'blue' },
    { title: 'Conversion Rate', value: '18.2%', icon: TrendingUp, change: 3.1, color: 'green' },
    { title: 'Total Value', value: formattedTotalValue, icon: DollarSign, change: -2.4, color: 'red' },
    { title: 'Active Deals', value: leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length.toString(), icon: Activity, change: 8.4, color: 'purple' },
  ];

  // Pipeline Target
  const pipelineTarget = 15; // Increased target to see progress better

  const handleAddLead = (newLeadData) => {
    addLead(newLeadData);
    toast.success('New lead added successfully!');
  };

  const handleExportData = () => {
    if (!leads || leads.length === 0) {
      toast.error('No leads to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Status', 'Source', 'Value', 'Created At'];
    const keys = ['id', 'name', 'company', 'email', 'phone', 'status', 'source', 'value', 'createdAt'];

    const csvContent = [
      headers.join(','),
      ...leads.map(lead =>
        keys.map(key => {
          let val = lead[key] === null || lead[key] === undefined ? '' : String(lead[key]);
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `startup_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show a success toast notification
    toast.success('Data exported successfully to your downloads folder.', {
      duration: 3000,
      icon: '📊',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's what's happening with your startup CRM today.</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2 flex">
          <div className="w-full">
            <PipelineOverview leads={leads} target={pipelineTarget} />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="lg:col-span-1 flex">
          <div className="w-full">
            <QuickActions 
              onOpenAddLead={() => setIsAddLeadModalOpen(true)}
              onExport={handleExportData}
            />
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <RecentLeads leads={leads} />
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal 
        isOpen={isAddLeadModalOpen} 
        onClose={() => setIsAddLeadModalOpen(false)} 
        onAdd={handleAddLead} 
      />
    </div>
  );
};

export default Dashboard;
