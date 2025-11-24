'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface RankingCardProps {
  title: string
  rank: number
  percentile: number
  topPercent?: number
  country?: string
}

export default function RankingCard({ title, rank, percentile, topPercent, country }: RankingCardProps) {
  const { themeConfig } = useTheme()
  
  const getRankEmoji = (percentile: number) => {
    if (percentile >= 99) return themeConfig.emojis.trophy
    if (percentile >= 95) return '🥇'
    if (percentile >= 90) return '🥈'
    if (percentile >= 80) return '🥉'
    if (percentile >= 70) return themeConfig.emojis.star
    return '📊'
  }

  const formatRank = (rank: number) => {
    if (rank >= 1_000_000) {
      return `${(rank / 1_000_000).toFixed(1)}M`
    }
    if (rank >= 1_000) {
      return `${(rank / 1_000).toFixed(1)}K`
    }
    return rank.toLocaleString()
  }

  const topPercentValue = topPercent ? topPercent.toFixed(1) : (100 - percentile).toFixed(1)

  return (
    <div 
      className="rounded-2xl p-8 shadow-2xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-2xl transform"
      style={{
        background: `linear-gradient(135deg, ${themeConfig.colors.card} 0%, ${themeConfig.colors.background} 100%)`,
        borderColor: themeConfig.colors.primary,
        boxShadow: `0 20px 40px ${themeConfig.colors.primary}30, 0 0 20px ${themeConfig.colors.primary}10`,
      }}
    >
      <div className="text-center">
        <div className="mb-6">
          <span className="text-6xl block mb-2 animate-float">{getRankEmoji(percentile)}</span>
          <h3 
            className="text-2xl font-bold mb-2"
            style={{ color: themeConfig.colors.text }}
          >
            {title}
          </h3>
          {country && (
            <p 
              className="text-sm mb-4"
              style={{ color: themeConfig.colors.textSecondary }}
            >
              📍 {country}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p 
              className="text-6xl font-extrabold mb-2 animate-bounce-slow"
              style={{ 
                color: themeConfig.colors.primary,
                textShadow: `0 0 20px ${themeConfig.colors.primary}40`,
              }}
            >
              Top {topPercentValue}%
            </p>
            <p 
              className="text-base font-medium"
              style={{ color: themeConfig.colors.textSecondary }}
            >
              Better than {percentile.toFixed(1)}% of users
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

