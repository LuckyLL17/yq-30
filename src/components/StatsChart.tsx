import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { ChartDataItem } from '@/types';

interface StatsChartProps {
  data: ChartDataItem[];
  type?: 'bar' | 'pie';
  title: string;
  color?: string;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#f43f5e', '#6366f1'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-xl bg-indigo-950/90 backdrop-blur-md border border-violet-500/30 shadow-xl">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-violet-300 text-sm mt-1">
          次数: {payload[0].value} · {payload[0].payload.percentage}
        </p>
      </div>
    );
  }
  return null;
};

const StatsChart: React.FC<StatsChartProps> = ({ data, type = 'bar', title, color = '#8b5cf6' }) => {
  const displayData = data.slice(0, 12);

  return (
    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-64">
        {type === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="name"
                stroke="#ffffff50"
                tick={{ fill: '#a5b4fc', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#ffffff50"
                tick={{ fill: '#a5b4fc', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8 - index * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: '#a5b4fc', fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StatsChart;
