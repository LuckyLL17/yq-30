import React from 'react';
import {
  PlanetSignCombinationCard,
  PlanetHouseCombinationCard,
  SignHouseCombinationCard,
  TripleCombinationCard,
} from '@/components/CombinationCard';
import { CombinationStats } from '@/types';

interface CombinationsTabProps {
  combinations: CombinationStats;
}

const CombinationsTab: React.FC<CombinationsTabProps> = ({ combinations }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlanetSignCombinationCard items={combinations.planetSign} />
        <PlanetHouseCombinationCard items={combinations.planetHouse} />
        <SignHouseCombinationCard items={combinations.signHouse} />
        <TripleCombinationCard items={combinations.triple} />
      </div>
    </div>
  );
};

export default CombinationsTab;
