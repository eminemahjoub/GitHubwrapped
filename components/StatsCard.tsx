'use client'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-primary-500">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

