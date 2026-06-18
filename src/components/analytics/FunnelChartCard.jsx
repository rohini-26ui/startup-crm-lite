import React, { memo, useState, useEffect } from 'react';
import { Filter, ChevronRight, TrendingDown } from 'lucide-react';
import { ChartCard } from './PieChartCard';

const STAGE_COLORS = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  Meeting: '#F59E0B',
  'Proposal Sent': '#7C3AED',
  Proposal: '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

const FunnelChartCard = memo(({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasData = data && data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <ChartCard title="Sales Funnel" subtitle="Lead progression through pipeline stages" icon={Filter}>
        <div className="h-80 flex flex-col items-center justify-center text-slate-400 text-sm">
          <Filter className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
          <span>No funnel data available</span>
        </div>
      </ChartCard>
    );
  }

  // Dimensions of SVG
  const width = 340;
  const height = 360;
  const cx = width / 2;

  const N = data.length;
  const totalHeight = 300;
  const yStart = 30;
  const gap = 10;
  const layerHeight = (totalHeight - (N - 1) * gap) / N; // 52px for 5 stages

  const W_max = 140; // max horizontal radius
  const W_min = 35;  // min horizontal radius

  return (
    <ChartCard title="Sales Funnel" subtitle="Lead progression through pipeline stages" icon={Filter}>
      <div className="flex justify-center items-center min-h-[380px] py-4">
        {/* SVG Funnel Visualizer */}
        <div className="w-full max-w-md flex justify-center relative">
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="max-w-[340px] drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
          >
            <defs>
              {/* cylindrical body gradient */}
              <linearGradient id="funnelBodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7DAEBF" />
                <stop offset="35%" stopColor="#97C2D3" />
                <stop offset="50%" stopColor="#9EC8D9" />
                <stop offset="75%" stopColor="#97C2D3" />
                <stop offset="100%" stopColor="#7DAEBF" />
              </linearGradient>

              {/* cylindrical body gradient hovered */}
              <linearGradient id="funnelBodyGradHover" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8EBDCE" />
                <stop offset="35%" stopColor="#A9D2E3" />
                <stop offset="50%" stopColor="#B2DAEA" />
                <stop offset="75%" stopColor="#A9D2E3" />
                <stop offset="100%" stopColor="#8EBDCE" />
              </linearGradient>

              {/* inner ellipse depth gradient */}
              <linearGradient id="funnelInnerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8797" />
                <stop offset="100%" stopColor="#71A0B1" />
              </linearGradient>

              {/* inner ellipse depth gradient hovered */}
              <linearGradient id="funnelInnerGradHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6C98A8" />
                <stop offset="100%" stopColor="#81B1C2" />
              </linearGradient>
            </defs>

            {data.map((item, idx) => {
              // Calculate vertical spans
              const y1 = yStart + idx * (layerHeight + gap);
              const y2 = y1 + layerHeight;

              // Calculate horizontal radii
              const rx1 = W_max - (W_max - W_min) * (idx / N);
              const rx2 = W_max - (W_max - W_min) * ((idx + 0.88) / N);

              // 3D perspective depth (vertical radius of ovals)
              const ry1 = rx1 * 0.16;
              const ry2 = rx2 * 0.16;

              const isHovered = hoveredIndex === idx;

              // Construct path for the front outer wall of the cone frustum
              const bodyPath = `
                M ${cx - rx1} ${y1}
                L ${cx - rx2} ${y2}
                A ${rx2} ${ry2} 0 0 0 ${cx + rx2} ${y2}
                L ${cx + rx1} ${y1}
                A ${rx1} ${ry1} 0 0 1 ${cx - rx1} ${y1}
              `.trim();

              return (
                <g
                  key={item.stage}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Outer body wall */}
                  <path
                    d={bodyPath}
                    fill={isHovered ? 'url(#funnelBodyGradHover)' : 'url(#funnelBodyGrad)'}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Top face ellipse (depth) */}
                  <ellipse
                    cx={cx}
                    cy={y1}
                    rx={rx1}
                    ry={ry1}
                    fill={isHovered ? 'url(#funnelInnerGradHover)' : 'url(#funnelInnerGrad)'}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Text inside the funnel layer */}
                  <text
                    x={cx}
                    y={y1 + layerHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none"
                    style={{ 
                      textShadow: '0px 0px 6px rgba(255,255,255,0.9), 0px 1px 3px rgba(255,255,255,0.9)', 
                      transition: 'all 0.3s ease' 
                    }}
                  >
                    <tspan x={cx} dy="-0.2em" fontSize="14" fontWeight="900" fill="#4169E1">
                      {item.stage}
                    </tspan>
                    <tspan x={cx} dy="1.4em" fontSize="12" fontWeight="800" fill="#4169E1">
                      {item.count} Leads
                      {idx > 0 && ` • ${item.convRate}%`}
                    </tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </ChartCard>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;
