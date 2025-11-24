'use client'

interface RankingCardProps {
  title: string
  rank: number
  percentile: number
  topPercent?: number
  country?: string
}

export default function RankingCard({ title, rank, percentile, topPercent, country }: RankingCardProps) {
  const getRankEmoji = (percentile: number) => {
    if (percentile >= 99) return '🏆'
    if (percentile >= 95) return '🥇'
    if (percentile >= 90) return '🥈'
    if (percentile >= 80) return '🥉'
    if (percentile >= 70) return '⭐'
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
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 shadow-lg border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <span className="text-3xl">{getRankEmoji(percentile)}</span>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600 mb-1">Rank</p>
          <p className="text-3xl font-extrabold text-primary-700">
            #{formatRank(rank)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Percentile</p>
          <p className="text-2xl font-bold text-primary-600">
            Top {topPercent ? topPercent.toFixed(1) : (100 - percentile).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Better than {percentile.toFixed(1)}% of users
          </p>
        </div>
        {country && (
          <div className="mt-3 pt-3 border-t border-primary-200">
            <p className="text-xs text-gray-500">📍 {country}</p>
          </div>
        )}
      </div>
    </div>
  )
}

