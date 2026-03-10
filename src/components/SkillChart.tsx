import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SkillChartProps {
  matched: number;
  missing: number;
}

export default function SkillChart({ matched, missing }: SkillChartProps) {
  const data = [
    { name: 'Matched Skills', value: matched },
    { name: 'Missing Skills', value: missing },
  ];

  const COLORS = ['#10b981', '#ef4444']; // emerald-500, red-500

  if (matched === 0 && missing === 0) {
    return <div className="text-slate-400 text-sm italic">No skills found to compare.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value} Skills`, '']}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
