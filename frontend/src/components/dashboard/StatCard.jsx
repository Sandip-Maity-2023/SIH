
import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorClasses[color] || colorClasses.emerald} shadow-sm flex items-center justify-between`}>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</span>
        <div className="text-2xl font-black mt-1">{value}</div>
        {subtitle && <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>}
      </div>
      {icon && <div className="text-3xl opacity-80">{icon}</div>}
    </div>
  );
};

export default StatCard;
