const StatsCard = ({ title, value, type = 'primary', icon = 'paid', trend = '+0.0%' }) => {
  const styles = {
    primary: {
      iconBg: 'bg-[#29382d]',
      iconColor: 'text-primary',
      trendBg: 'bg-primary/10',
      trendColor: 'text-primary',
      glow: 'bg-primary/5 group-hover:bg-primary/10'
    },
    blue: {
      iconBg: 'bg-[#29382d]',
      iconColor: 'text-blue-400',
      trendBg: 'bg-white/5',
      trendColor: 'text-text-secondary',
      glow: 'bg-blue-500/5 group-hover:bg-blue-500/10'
    },
    purple: {
      iconBg: 'bg-[#29382d]',
      iconColor: 'text-purple-400',
      trendBg: 'bg-primary/10',
      trendColor: 'text-primary',
      glow: 'bg-purple-500/5 group-hover:bg-purple-500/10'
    },
    white: {
      iconBg: 'bg-[#29382d]',
      iconColor: 'text-white',
      trendBg: 'bg-primary/10',
      trendColor: 'text-primary',
      glow: 'bg-primary/5 group-hover:bg-primary/10'
    }
  };

  const currentStyle = styles[type] || styles.primary;

  return (
    <div className="bg-surface-dark border border-[#29382d] p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 size-32 rounded-full transition-colors ${currentStyle.glow}`}></div>
      <div className="flex justify-between items-start z-10">
        <div className={`p-2 rounded-lg ${currentStyle.iconBg} ${currentStyle.iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`${currentStyle.trendColor} text-sm font-bold flex items-center ${currentStyle.trendBg} px-2 py-1 rounded`}>
          {trend} <span className="material-symbols-outlined text-sm ml-1">trending_up</span>
        </span>
      </div>
      <div className="z-10">
        <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;


