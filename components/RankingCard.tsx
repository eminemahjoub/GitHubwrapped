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

  return (
    <div 
      className="rounded-xl p-6 shadow-lg border-2 transition-all"
      style={{
        background: `linear-gradient(to bottom right, ${themeConfig.colors.card}, ${themeConfig.colors.background})`,
        borderColor: themeConfig.colors.primary,
        boxShadow: `0 10px 30px ${themeConfig.colors.primary}20`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-bold"
          style={{ color: themeConfig.colors.text }}
        >
          {title}
        </h3>
        <span className="text-3xl">{getRankEmoji(percentile)}</span>
      </div>
      <div className="space-y-2">
        <div>
          <p 
            className="text-sm mb-1"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            Rank
          </p>
          <p 
            className="text-3xl font-extrabold"
            style={{ color: themeConfig.colors.primary }}
          >
            #{formatRank(rank)}
          </p>
        </div>
        <div>
          <p 
            className="text-sm mb-1"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            Percentile
          </p>
          <p 
            className="text-2xl font-bold"
            style={{ color: themeConfig.colors.primary }}
          >
            Top {topPercent ? topPercent.toFixed(1) : (100 - percentile).toFixed(1)}%
          </p>
          <p 
            className="text-xs mt-1"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            Better than {percentile.toFixed(1)}% of users
          </p>
        </div>
        {country && (
          <div 
            className="mt-3 pt-3 border-t"
            style={{ borderColor: themeConfig.colors.border }}
          >
            <p 
              className="text-xs"
              style={{ color: themeConfig.colors.textSecondary }}
            >
              📍 {country}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

