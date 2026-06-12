import React from 'react';
import StatsChart from '@/components/StatsChart';
import ProgressBar from '@/components/ProgressBar';
import TypeTag from '@/components/TypeTag';
import SectionCard from '@/components/SectionCard';
import { ChartDataItem, TypeDistributionItem } from '@/types';

interface DistributionTabProps {
  elementDist: ChartDataItem[];
  modalityDist: ChartDataItem[];
  typeDistribution: TypeDistributionItem[];
}

const DistributionTab: React.FC<DistributionTabProps> = ({
  elementDist,
  modalityDist,
  typeDistribution,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart data={elementDist} type="pie" title="四元素分布" />
        <StatsChart data={modalityDist} type="pie" title="三方性分布" />
      </div>

      <SectionCard title="按问题类型分布">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {typeDistribution.map((item) => (
            <div
              key={item.typeId}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <TypeTag name={item.name} color={item.color} />
                <span className="text-white font-semibold">{item.count}条</span>
              </div>
              <ProgressBar
                percentage={parseFloat(item.percentage)}
                color={item.color}
                showLabel={false}
              />
              <div className="text-right text-xs text-indigo-400/60 mt-1">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default DistributionTab;
