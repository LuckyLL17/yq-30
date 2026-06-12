import React from 'react';
import HeatmapChart from '@/components/HeatmapChart';
import { HeatmapData } from '@/types';

interface HeatmapTabProps {
  heatmapData: HeatmapData[];
}

const HeatmapTab: React.FC<HeatmapTabProps> = ({ heatmapData }) => {
  return (
    <div className="space-y-6">
      {heatmapData.map((hm, idx) => (
        <HeatmapChart key={idx} data={hm} />
      ))}
    </div>
  );
};

export default HeatmapTab;
