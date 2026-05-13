interface EventStatsProps {
  label: string;
  value: string | number;
  icon: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: 'up' | 'down';
}

const colorClasses = {
  blue: 'bg-blue-900/30 text-blue-400',
  green: 'bg-green-900/30 text-green-400',
  purple: 'bg-purple-900/30 text-purple-400',
  orange: 'bg-orange-900/30 text-orange-400',
  red: 'bg-red-900/30 text-red-400',
};

const trendIcons = {
  up: '📈',
  down: '📉',
};

export default function EventStats({
  label,
  value,
  icon,
  color = 'blue',
  trend,
}: EventStatsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-3xl p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-2xl">
            {trendIcons[trend]}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}
