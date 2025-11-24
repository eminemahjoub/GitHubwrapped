'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface ContributionDay {
  date: string
  contributionCount: number
}

interface CalendarHeatmapProps {
  days: ContributionDay[]
}

export default function CalendarHeatmap({ days }: CalendarHeatmapProps) {
  const { themeConfig } = useTheme()
  
  // Group days by week
  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []
  
  days.forEach((day, index) => {
    const date = new Date(day.date)
    const dayOfWeek = date.getDay()
    
    // Start new week on Sunday
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = [day]
    } else {
      currentWeek.push(day)
    }
    
    // Push last week
    if (index === days.length - 1) {
      weeks.push(currentWeek)
    }
  })

  const getIntensityColor = (count: number): string => {
    if (count === 0) return themeConfig.colors.border
    const opacity = Math.min(1, count / 20)
    const r = parseInt(themeConfig.colors.primary.slice(1, 3), 16)
    const g = parseInt(themeConfig.colors.primary.slice(3, 5), 16)
    const b = parseInt(themeConfig.colors.primary.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${0.2 + opacity * 0.8})`
  }

  const maxContributions = Math.max(...days.map((d) => d.contributionCount))

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1 p-4">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const date = new Date(day.date)
                const isToday = date.toDateString() === new Date().toDateString()
                
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-3 h-3 rounded-sm transition-all hover:scale-125"
                    style={{
                      backgroundColor: getIntensityColor(day.contributionCount),
                      border: isToday ? `2px solid ${themeConfig.colors.primary}` : 'none',
                    }}
                    title={`${date.toLocaleDateString()}: ${day.contributionCount} contributions`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div 
          className="flex items-center justify-between mt-2 text-sm"
          style={{ color: themeConfig.colors.textSecondary }}
        >
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 2, 5, 10, 20].map((count) => (
              <div
                key={count}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getIntensityColor(count) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

