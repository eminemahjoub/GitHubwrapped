'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  const { themeConfig } = useTheme()
  
  return (
    <div 
      className="rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 hover:scale-105 hover:-translate-y-2 transform"
      style={{
        backgroundColor: themeConfig.colors.card,
        borderColor: themeConfig.colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 
          className="text-sm font-medium"
          style={{ color: themeConfig.colors.textSecondary }}
        >
          {title}
        </h3>
        {icon && (
          <div className="animate-bounce-slow" style={{ color: themeConfig.colors.primary }}>{icon}</div>
        )}
      </div>
      <p 
        className="text-3xl font-bold transition-all duration-300 hover:scale-110 inline-block"
        style={{ color: themeConfig.colors.text }}
      >
        {value}
      </p>
      {subtitle && (
        <p 
          className="text-sm mt-1"
          style={{ color: themeConfig.colors.textSecondary }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

