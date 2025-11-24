'use client'

interface ContributionDay {
  date: string
  contributionCount: number
}

interface CalendarHeatmapProps {
  days: ContributionDay[]
}

export default function CalendarHeatmap({ days }: CalendarHeatmapProps) {
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

  const getIntensity = (count: number): string => {
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-primary-200'
    if (count <= 5) return 'bg-primary-400'
    if (count <= 10) return 'bg-primary-600'
    return 'bg-primary-800'
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
                    className={`w-3 h-3 rounded-sm ${getIntensity(
                      day.contributionCount
                    )} ${isToday ? 'ring-2 ring-primary-500' : ''}`}
                    title={`${date.toLocaleDateString()}: ${day.contributionCount} contributions`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-primary-200" />
            <div className="w-3 h-3 rounded-sm bg-primary-400" />
            <div className="w-3 h-3 rounded-sm bg-primary-600" />
            <div className="w-3 h-3 rounded-sm bg-primary-800" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

