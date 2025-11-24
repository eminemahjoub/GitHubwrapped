'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function SearchCounter() {
  const { themeConfig } = useTheme()
  const [count, setCount] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Fetch current count
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0))
  }, [])

  const incrementCount = async () => {
    try {
      const response = await fetch('/api/stats', { method: 'POST' })
      const data = await response.json()
      setCount(data.count)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    } catch (error) {
      console.error('Failed to increment count:', error)
    }
  }

  // Expose increment function to parent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).incrementSearchCount = incrementCount
    }
  }, [])

  if (count === null) return null

  return (
    <div 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all"
      style={{
        backgroundColor: `${themeConfig.colors.primary}10`,
        borderColor: themeConfig.colors.primary,
      }}
    >
      <span 
        className="text-sm font-medium"
        style={{ color: themeConfig.colors.textSecondary }}
      >
        🔍
      </span>
      <span 
        className="text-sm font-medium"
        style={{ color: themeConfig.colors.textSecondary }}
      >
        <span className="font-bold" style={{ color: themeConfig.colors.primary }}>
          {count.toLocaleString()}
        </span>
        {' '}searches
      </span>
    </div>
  )
}

