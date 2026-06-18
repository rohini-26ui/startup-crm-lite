import React, { memo, useState, useEffect } from 'react';
import { Filter, ChevronRight, TrendingDown } from 'lucide-react';
import { ChartCard } from './PieChartCard';

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
      <div className="flex flex-col md:flex-row gap-8 items-center min-h-[380px]">
        {/* SVG Funnel Visualizer */}
        <div className="w-full md:w-3/5 flex justify-center relative">
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

                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Metrics Panel */}
        <div
          className="w-full md:w-2/5 flex flex-col justify-start md:mt-0 mt-6"
          style={isDesktop ? { paddingTop: `${yStart}px`, gap: `${gap}px` } : { gap: '12px' }}
        >
          {data.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.stage}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-3 rounded-xl border flex flex-col justify-center transition-all duration-300 ${
                  isHovered
                    ? 'bg-slate-50 border-slate-300 shadow-sm translate-x-1'
                    : 'bg-white border-slate-200'
                }`}
                style={isDesktop ? { height: `${layerHeight}px` } : {}}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: isHovered ? '#71A0B1' : '#88B2C4' }}
                    />
                    <span className="text-xs font-bold text-slate-700 truncate">{item.stage}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-slate-800">{item.count} Leads</span>
                    {idx > 0 ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.convRate}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        100%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;
