import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ROIChat = ({ dashboardData }) => {
  const chartData = dashboardData?.chartData?.map(item => ({
    name: item.date,
    roi: item.amount
  })) || [];

  return (
    <div className="flex-1 w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <Tooltip
            cursor={{ fill: '#29382d', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#1a241c', borderColor: '#29382d', color: '#fff' }}
            itemStyle={{ color: '#19e64d' }}
            formatter={(value) => [`₹${value.toFixed(2)}`, 'ROI']}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9db8a4', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <Bar dataKey="roi" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === chartData.length - 1 ? '#19e64d' : 'rgba(25, 230, 77, 0.2)'}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ROIChat;

