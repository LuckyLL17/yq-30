import React, { useMemo, useState } from 'react';
import { HeatmapData } from '@/types';

interface HeatmapChartProps {
  data: HeatmapData;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string; value: number } | null>(null);

  const cellMap = useMemo(() => {
    const map = new Map<string, number>();
    data.cells.forEach(cell => {
      map.set(`${cell.row}-${cell.col}`, cell.value);
    });
    return map;
  }, [data.cells]);

  const getColor = (value: number): string => {
    if (value === 0) return 'rgba(255,255,255,0.03)';
    const intensity = data.maxValue > 0 ? value / data.maxValue : 0;
    const alpha = 0.2 + intensity * 0.8;
    return `rgba(139, 92, 246, ${alpha})`;
  };

  const colLabelDisplay = (label: string) => {
    if (data.title.includes('宫位')) {
      return label + '宫';
    }
    return label.length > 2 ? label.slice(0, 2) : label;
  };

  return (
    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">{data.title}</h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-20 shrink-0" />
            <div className="flex-1">
              <div className="flex">
                {data.colLabels.map((col) => (
                  <div
                    key={col}
                    className="flex-1 text-center text-[10px] text-indigo-300/60 pb-1.5 truncate px-0.5"
                  >
                    {colLabelDisplay(col)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {data.rowLabels.map((row) => (
            <div key={row} className="flex items-center">
              <div className="w-20 shrink-0 text-right text-xs text-indigo-300/70 pr-2 truncate">
                {row}
              </div>
              <div className="flex-1 flex">
                {data.colLabels.map((col) => {
                  const value = cellMap.get(`${row}-${col}`) || 0;
                  const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="flex-1 aspect-square m-[1px] rounded-sm cursor-pointer transition-all duration-150 relative"
                      style={{
                        backgroundColor: getColor(value),
                        border: isHovered ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        zIndex: isHovered ? 10 : 1,
                      }}
                      onMouseEnter={() => setHoveredCell({ row, col, value })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {value > 0 && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-white/80">
                          {value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hoveredCell && (
            <div className="mt-3 text-center text-sm text-indigo-200/80 transition-all">
              <span className="text-white font-medium">{hoveredCell.row}</span>
              <span className="text-indigo-400/60 mx-1">×</span>
              <span className="text-white font-medium">
                {data.title.includes('宫位') ? `第${hoveredCell.col}宫` : hoveredCell.col}
              </span>
              <span className="text-indigo-400/60 mx-2">:</span>
              <span className="text-amber-300 font-semibold">{hoveredCell.value}次</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-indigo-300/50">
            <span>少</span>
            <div className="flex gap-0.5">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-3 rounded-sm"
                  style={{ backgroundColor: intensity === 0 ? 'rgba(255,255,255,0.03)' : `rgba(139, 92, 246, ${0.2 + intensity * 0.8})` }}
                />
              ))}
            </div>
            <span>多</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
