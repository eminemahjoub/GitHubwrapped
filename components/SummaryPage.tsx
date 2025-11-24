'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import CalendarHeatmap from './CalendarHeatmap'
import StatsCard from './StatsCard'
import LanguageChart from './LanguageChart'

interface User {
  login: string
  name: string
  avatarUrl: string
}

interface Summary {
  totalContributions: number
  totalCommits: number
  totalIssues: number
  totalPullRequests: number
  totalReviews: number
  longestStreak: number
  currentStreak: number
  totalStars: number
  reposUpdated: number
}

interface ContributionDay {
  date: string
  contributionCount: number
}

interface Language {
  name: string
  color: string
  percentage: number
}

interface SummaryPageProps {
  user: User
  summary: Summary
  calendar: ContributionDay[]
  languages: Language[]
  onBack: () => void
}

export default function SummaryPage({
  user,
  summary,
  calendar,
  languages,
  onBack,
}: SummaryPageProps) {
  const summaryRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (!summaryRef.current) return

    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
      })
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `github-wrapped-${user.login}-${new Date().getFullYear()}.png`
      link.href = url
      link.click()
    } catch (error) {
      console.error('Error exporting image:', error)
      alert('Failed to export image. Please try again.')
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Search
          </button>
          <button
            onClick={handleExport}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            Export Image
          </button>
        </div>

        <div ref={summaryRef} className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={user.avatarUrl}
                alt={user.login}
                className="w-20 h-20 rounded-full border-4 border-primary-200"
              />
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  {user.name || user.login}
                </h1>
                <p className="text-xl text-gray-600">@{user.login}</p>
              </div>
            </div>
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {currentYear} Year in Code
            </h2>
          </div>

          {/* Milestones */}
          <div className="mb-8 space-y-3 text-center">
            <p className="text-2xl text-gray-700">
              You made <span className="font-bold text-primary-600">{summary.totalCommits.toLocaleString()}</span> commits
            </p>
            <p className="text-2xl text-gray-700">
              Your longest streak was <span className="font-bold text-primary-600">{summary.longestStreak}</span> days
            </p>
            {summary.currentStreak > 0 && (
              <p className="text-2xl text-gray-700">
                You're on a <span className="font-bold text-primary-600">{summary.currentStreak}</span> day streak! 🔥
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Contributions"
              value={summary.totalContributions.toLocaleString()}
              subtitle="Commits, PRs, Issues & Reviews"
            />
            <StatsCard
              title="Pull Requests"
              value={summary.totalPullRequests.toLocaleString()}
              subtitle="PRs created this year"
            />
            <StatsCard
              title="Issues"
              value={summary.totalIssues.toLocaleString()}
              subtitle="Issues created this year"
            />
            <StatsCard
              title="Code Reviews"
              value={summary.totalReviews.toLocaleString()}
              subtitle="PR reviews this year"
            />
            <StatsCard
              title="Longest Streak"
              value={`${summary.longestStreak} days`}
              subtitle="Best contribution streak"
            />
            <StatsCard
              title="Current Streak"
              value={`${summary.currentStreak} days`}
              subtitle="Active contribution streak"
            />
            <StatsCard
              title="Stars Received"
              value={summary.totalStars.toLocaleString()}
              subtitle="On repos updated this year"
            />
            <StatsCard
              title="Repos Updated"
              value={summary.reposUpdated.toLocaleString()}
              subtitle="Public repos this year"
            />
          </div>

          {/* Calendar Heatmap */}
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Contribution Calendar
            </h3>
            <CalendarHeatmap days={calendar} />
          </div>

          {/* Language Chart */}
          {languages.length > 0 && (
            <div className="mb-8">
              <LanguageChart languages={languages} />
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
            <p>Generated with GitHub Wrapped • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

