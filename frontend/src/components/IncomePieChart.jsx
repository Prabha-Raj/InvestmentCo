import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomePieChart = ({ dashboardData }) => {
    const data = [
        { name: 'ROI Income', value: dashboardData?.totalROIEarned || 0 },
        { name: 'Level Income', value: dashboardData?.levelIncome || 0 },
    ];

    const COLORS = ['#4F46E5', '#10B981']; // Indigo and Emerald

    // Filter out zero values to avoid ugly empty pie slices
    const activeData = data.filter(d => d.value > 0);

    if (activeData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-400">
                No income data yet
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {activeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default IncomePieChart;
