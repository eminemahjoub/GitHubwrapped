'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { useTheme } from '@/contexts/ThemeContext'
import CalendarHeatmap from './CalendarHeatmap'
import StatsCard from './StatsCard'
import LanguageChart from './LanguageChart'
import RankingCard from './RankingCard'

interface User {
  login: string
  name: string
  avatarUrl: string
  location?: string | null
  country?: string | null
}

interface Rankings {
  world: {
    rank: number
    percentile: number
    topPercent: number
  }
  country: {
    name: string
    rank: number
    percentile: number
    topPercent: number
  } | null
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
  rankings: Rankings
  onBack: () => void
}

export default function SummaryPage({
  user,
  summary,
  calendar,
  languages,
  rankings,
  onBack,
}: SummaryPageProps) {
  const { themeConfig } = useTheme()
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
    <div 
      className="min-h-screen py-8 px-4 transition-all"
      style={{
        background: `linear-gradient(to bottom right, ${themeConfig.colors.background}, ${themeConfig.colors.card})`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onBack}
            className="font-medium transition-colors hover:opacity-80"
            style={{ color: themeConfig.colors.primary }}
          >
            ← Back to Search
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 rounded-lg transition-colors shadow-md hover:opacity-90"
            style={{
              backgroundColor: themeConfig.colors.primary,
              color: '#fff',
            }}
          >
            Export Image
          </button>
        </div>

        <div 
          ref={summaryRef} 
          className="rounded-2xl shadow-2xl p-8 transition-all"
          style={{
            backgroundColor: themeConfig.colors.card,
            border: `2px solid ${themeConfig.colors.border}`,
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={user.avatarUrl}
                alt={user.login}
                className="w-20 h-20 rounded-full border-4"
                style={{ borderColor: themeConfig.colors.primary }}
              />
              <div className="text-left">
                <h1 
                  className="text-4xl font-bold"
                  style={{ color: themeConfig.colors.text }}
                >
                  {user.name || user.login}
                </h1>
                <p 
                  className="text-xl"
                  style={{ color: themeConfig.colors.textSecondary }}
                >
                  @{user.login}
                </p>
              </div>
            </div>
            <h2 
              className="text-5xl font-extrabold"
              style={{ 
                color: themeConfig.colors.primary,
                fontFamily: themeConfig.fonts.heading,
              }}
            >
              {currentYear} Year in Code
            </h2>
          </div>

          {/* Milestones */}
          <div className="mb-8 space-y-3 text-center">
            <p 
              className="text-2xl"
              style={{ color: themeConfig.colors.text }}
            >
              You made <span 
                className="font-bold"
                style={{ color: themeConfig.colors.primary }}
              >{summary.totalCommits.toLocaleString()}</span> commits
            </p>
            <p 
              className="text-2xl"
              style={{ color: themeConfig.colors.text }}
            >
              Your longest streak was <span 
                className="font-bold"
                style={{ color: themeConfig.colors.primary }}
              >{summary.longestStreak}</span> days
            </p>
            {summary.currentStreak > 0 && (
              <p 
                className="text-2xl"
                style={{ color: themeConfig.colors.text }}
              >
                You're on a <span 
                  className="font-bold"
                  style={{ color: themeConfig.colors.primary }}
                >{summary.currentStreak}</span> day streak! {themeConfig.emojis.fire}
              </p>
            )}
          </div>

          {/* Rankings */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Your Rankings 🏆
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RankingCard
                title="World Ranking"
                rank={rankings.world.rank}
                percentile={rankings.world.percentile}
                topPercent={rankings.world.topPercent}
              />
              {rankings.country && (
                <RankingCard
                  title="Country Ranking"
                  rank={rankings.country.rank}
                  percentile={rankings.country.percentile}
                  topPercent={rankings.country.topPercent}
                  country={rankings.country.name}
                />
              )}
            </div>
            {!rankings.country && user.location && (
              <p className="text-center text-gray-500 text-sm mt-4">
                💡 Add your location to your GitHub profile to see country rankings
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

