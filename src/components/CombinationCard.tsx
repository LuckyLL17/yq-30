import React from 'react';
import { PlanetSignCombination, PlanetHouseCombination, SignHouseCombination, TripleCombination } from '@/types';
import { getPlanetByName, getSignByName } from '@/utils/diceData';

type CombinationItem = PlanetSignCombination | PlanetHouseCombination | SignHouseCombination | TripleCombination;

interface CombinationCardProps {
  title: string;
  dotColor: string;
  badgeGradient: string;
  badgeTextColor: string;
  items: CombinationItem[];
  limit?: number;
  renderItem: (item: CombinationItem, index: number) => React.ReactNode;
}

const CombinationCard: React.FC<CombinationCardProps> = ({
  title,
  dotColor,
  badgeGradient,
  badgeTextColor,
  items,
  limit = 5,
  renderItem,
}) => {
  return (
    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {title}
      </h3>
      <div className="space-y-3">
        {items.slice(0, limit).map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${badgeGradient} flex items-center justify-center text-sm font-bold ${badgeTextColor}`}
              >
                #{idx + 1}
              </span>
              {renderItem(item, idx)}
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{item.count}次</div>
              <div className="text-xs text-indigo-400/60">{item.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlanetSignCombinationCard: React.FC<{ items: PlanetSignCombination[] }> = ({ items }) => (
  <CombinationCard
    title="行星 + 星座 热门组合"
    dotColor="bg-amber-400"
    badgeGradient="from-amber-500/30 to-orange-600/30"
    badgeTextColor="text-amber-300"
    items={items}
    renderItem={(item) => {
      const combo = item as PlanetSignCombination;
      const planet = getPlanetByName(combo.planet);
      const sign = getSignByName(combo.sign);
      return (
        <div className="flex items-center gap-2">
          <span className="text-xl">{planet?.symbol}</span>
          <span className="text-white font-medium">{combo.planet}</span>
          <span className="text-indigo-400/60">+</span>
          <span className="text-xl">{sign?.symbol}</span>
          <span className="text-white font-medium">{combo.sign}</span>
        </div>
      );
    }}
  />
);

export const PlanetHouseCombinationCard: React.FC<{ items: PlanetHouseCombination[] }> = ({ items }) => (
  <CombinationCard
    title="行星 + 宫位 热门组合"
    dotColor="bg-violet-400"
    badgeGradient="from-violet-500/30 to-purple-600/30"
    badgeTextColor="text-violet-300"
    items={items}
    renderItem={(item) => {
      const combo = item as PlanetHouseCombination;
      const planet = getPlanetByName(combo.planet);
      return (
        <div className="flex items-center gap-2">
          <span className="text-xl">{planet?.symbol}</span>
          <span className="text-white font-medium">{combo.planet}</span>
          <span className="text-indigo-400/60">+</span>
          <span className="text-white font-medium">{combo.house}宫</span>
        </div>
      );
    }}
  />
);

export const SignHouseCombinationCard: React.FC<{ items: SignHouseCombination[] }> = ({ items }) => (
  <CombinationCard
    title="星座 + 宫位 热门组合"
    dotColor="bg-blue-400"
    badgeGradient="from-blue-500/30 to-cyan-600/30"
    badgeTextColor="text-blue-300"
    items={items}
    renderItem={(item) => {
      const combo = item as SignHouseCombination;
      const sign = getSignByName(combo.sign);
      return (
        <div className="flex items-center gap-2">
          <span className="text-xl">{sign?.symbol}</span>
          <span className="text-white font-medium">{combo.sign}</span>
          <span className="text-indigo-400/60">+</span>
          <span className="text-white font-medium">{combo.house}宫</span>
        </div>
      );
    }}
  />
);

export const TripleCombinationCard: React.FC<{ items: TripleCombination[] }> = ({ items }) => (
  <CombinationCard
    title="完整三元素 热门组合"
    dotColor="bg-rose-400"
    badgeGradient="from-rose-500/30 to-pink-600/30"
    badgeTextColor="text-rose-300"
    items={items}
    renderItem={(item) => {
      const combo = item as TripleCombination;
      const planet = getPlanetByName(combo.planet);
      const sign = getSignByName(combo.sign);
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{planet?.symbol}</span>
          <span className="text-lg">{sign?.symbol}</span>
          <span className="text-sm font-bold text-white">{combo.house}</span>
        </div>
      );
    }}
  />
);

export default CombinationCard;
