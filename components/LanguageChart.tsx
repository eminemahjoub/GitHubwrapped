'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Language {
  name: string
  color: string
  percentage: number
}

interface LanguageChartProps {
  languages: Language[]
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const data = languages.slice(0, 10).map((lang) => ({
    name: lang.name,
    value: lang.percentage,
    color: lang.color || '#0ea5e9',
  }))

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Top Languages</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

