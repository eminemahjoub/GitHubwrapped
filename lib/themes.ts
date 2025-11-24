export type Theme = 'coder' | 'hacker' | 'anime'

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    backgroundGradient: string
    text: string
    textSecondary: string
    card: string
    border: string
    success: string
    warning: string
  }
  fonts: {
    heading: string
    body: string
  }
  styles: {
    cardStyle: string
    buttonStyle: string
    inputStyle: string
  }
  emojis: {
    trophy: string
    fire: string
    star: string
    code: string
  }
}

export const themes: Record<Theme, ThemeConfig> = {
  coder: {
    name: 'Coder',
    colors: {
      primary: '#0ea5e9', // Sky blue
      secondary: '#3b82f6', // Blue
      accent: '#06b6d4', // Cyan
      background: '#0f172a', // Slate 900
      backgroundGradient: 'from-slate-900 via-slate-800 to-slate-900',
      text: '#f1f5f9', // Slate 100
      textSecondary: '#cbd5e1', // Slate 300
      card: '#1e293b', // Slate 800
      border: '#334155', // Slate 700
      success: '#10b981', // Green
      warning: '#f59e0b', // Amber
    },
    fonts: {
      heading: 'font-mono',
      body: 'font-mono',
    },
    styles: {
      cardStyle: 'bg-slate-800 border-slate-700 shadow-lg shadow-blue-500/10',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500',
      inputStyle: 'bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-500',
    },
    emojis: {
      trophy: '🏆',
      fire: '🔥',
      star: '⭐',
      code: '💻',
    },
  },
  hacker: {
    name: 'Hacker',
    colors: {
      primary: '#00ff00', // Green
      secondary: '#00ff41', // Bright green
      accent: '#39ff14', // Neon green
      background: '#000000', // Black
      backgroundGradient: 'from-black via-gray-900 to-black',
      text: '#00ff00', // Green
      textSecondary: '#00ff41', // Bright green
      card: '#0a0a0a', // Almost black
      border: '#00ff00', // Green
      success: '#00ff00',
      warning: '#ffff00', // Yellow
    },
    fonts: {
      heading: 'font-mono',
      body: 'font-mono',
    },
    styles: {
      cardStyle: 'bg-black border-green-500 shadow-lg shadow-green-500/20',
      buttonStyle: 'bg-green-600 hover:bg-green-700 text-black border-green-400',
      inputStyle: 'bg-black border-green-500 text-green-400 focus:border-green-400 focus:ring-green-500',
    },
    emojis: {
      trophy: '💀',
      fire: '⚡',
      star: '🔮',
      code: '🎯',
    },
  },
  anime: {
    name: 'Anime',
    colors: {
      primary: '#ff6b9d', // Pink
      secondary: '#c44569', // Dark pink
      accent: '#f8b500', // Gold
      background: '#fff5f5', // Rose 50
      backgroundGradient: 'from-pink-50 via-purple-50 to-pink-50',
      text: '#1f2937', // Gray 800
      textSecondary: '#6b7280', // Gray 500
      card: '#ffffff', // White
      border: '#fce7f3', // Pink 100
      success: '#ec4899', // Pink 500
      warning: '#f59e0b', // Amber
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans',
    },
    styles: {
      cardStyle: 'bg-white border-pink-200 shadow-lg shadow-pink-200/50',
      buttonStyle: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-pink-300',
      inputStyle: 'bg-white border-pink-200 text-gray-800 focus:border-pink-400 focus:ring-pink-300',
    },
    emojis: {
      trophy: '✨',
      fire: '🌸',
      star: '💫',
      code: '🎨',
    },
  },
}

export function getTheme(theme: Theme): ThemeConfig {
  return themes[theme]
}

