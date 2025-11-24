'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const { themeConfig } = useTheme()
  
  return (
    <div 
      className="rounded-lg p-6 text-center border-2"
      style={{
        backgroundColor: themeConfig.colors.card,
        borderColor: themeConfig.colors.warning,
      }}
    >
      <div 
        className="mb-2"
        style={{ color: themeConfig.colors.warning }}
      >
        <svg
          className="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p 
        className="font-medium mb-4"
        style={{ color: themeConfig.colors.text }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: themeConfig.colors.warning,
            color: '#fff',
          }}
        >
          Try Again
        </button>
      )}
    </div>
  )
}

