'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'

interface Language {
  name: string
  color: string
  percentage: number
}

interface LanguageChartProps {
  languages: Language[]
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const { themeConfig } = useTheme()
  const data = languages.slice(0, 10).map((lang) => ({
    name: lang.name,
    value: lang.percentage,
    color: lang.color || themeConfig.colors.primary,
  }))

  return (
    <div 
      className="w-full rounded-xl p-6 shadow-lg border-2"
      style={{
        backgroundColor: themeConfig.colors.card,
        borderColor: themeConfig.colors.border,
      }}
    >
      <h3 
        className="text-xl font-bold mb-4"
        style={{ color: themeConfig.colors.text }}
      >
        Top Languages
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis 
            type="number" 
            domain={[0, 100]}
            stroke={themeConfig.colors.textSecondary}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100}
            stroke={themeConfig.colors.textSecondary}
          />
          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              backgroundColor: themeConfig.colors.card,
              border: `1px solid ${themeConfig.colors.border}`,
              borderRadius: '8px',
              color: themeConfig.colors.text,
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

