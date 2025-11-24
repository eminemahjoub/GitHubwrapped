import { NextRequest, NextResponse } from 'next/server'

const GITHUB_API_URL = 'https://api.github.com/graphql'
const GITHUB_REST_API_URL = 'https://api.github.com'

interface ContributionDay {
  date: string
  contributionCount: number
}

interface ContributionsCollection {
  totalCommitContributions: number
  totalIssueContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
  contributionCalendar: {
    totalContributions: number
    weeks: Array<{
      contributionDays: ContributionDay[]
    }>
  }
  contributionYears: number[]
  firstIssueContribution?: {
    occurredAt: string
  }
  firstPullRequestContribution?: {
    occurredAt: string
  }
}

interface Language {
  name: string
  color: string
  size: number
}

interface Repository {
  name: string
  stargazerCount: number
  languages: {
    edges: Array<{
      size: number
      node: {
        name: string
        color: string
      }
    }>
  }
  updatedAt: string
}

interface UserData {
  user: {
    login: string
    name: string
    avatarUrl: string
    contributionsCollection: ContributionsCollection
    repositories: {
      nodes: Repository[]
    }
  }
}

function getCurrentYearDates() {
  const now = new Date()
  const year = now.getFullYear()
  const from = `${year}-01-01T00:00:00Z`
  const to = `${year}-12-31T23:59:59Z`
  return { from, to }
}

async function fetchUserLocation(username: string, token: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_REST_API_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      return null
    }

    const userData = await response.json()
    return userData.location || null
  } catch (error) {
    console.error('Error fetching user location:', error)
    return null
  }
}

function extractCountry(location: string | null): string | null {
  if (!location) return null

  // Common country patterns
  const countryPatterns: { [key: string]: string } = {
    'usa': 'United States',
    'united states': 'United States',
    'us': 'United States',
    'uk': 'United Kingdom',
    'united kingdom': 'United Kingdom',
    'canada': 'Canada',
    'germany': 'Germany',
    'france': 'France',
    'spain': 'Spain',
    'italy': 'Italy',
    'netherlands': 'Netherlands',
    'belgium': 'Belgium',
    'sweden': 'Sweden',
    'norway': 'Norway',
    'denmark': 'Denmark',
    'finland': 'Finland',
    'poland': 'Poland',
    'portugal': 'Portugal',
    'greece': 'Greece',
    'ireland': 'Ireland',
    'switzerland': 'Switzerland',
    'austria': 'Austria',
    'czech republic': 'Czech Republic',
    'romania': 'Romania',
    'hungary': 'Hungary',
    'croatia': 'Croatia',
    'bulgaria': 'Bulgaria',
    'slovakia': 'Slovakia',
    'slovenia': 'Slovenia',
    'estonia': 'Estonia',
    'latvia': 'Latvia',
    'lithuania': 'Lithuania',
    'japan': 'Japan',
    'china': 'China',
    'india': 'India',
    'south korea': 'South Korea',
    'singapore': 'Singapore',
    'malaysia': 'Malaysia',
    'thailand': 'Thailand',
    'indonesia': 'Indonesia',
    'philippines': 'Philippines',
    'vietnam': 'Vietnam',
    'australia': 'Australia',
    'new zealand': 'New Zealand',
    'brazil': 'Brazil',
    'argentina': 'Argentina',
    'chile': 'Chile',
    'colombia': 'Colombia',
    'mexico': 'Mexico',
    'south africa': 'South Africa',
    'egypt': 'Egypt',
    'israel': 'Israel',
    'turkey': 'Turkey',
    'russia': 'Russia',
    'ukraine': 'Ukraine',
    'pakistan': 'Pakistan',
    'bangladesh': 'Bangladesh',
    'nigeria': 'Nigeria',
    'kenya': 'Kenya',
    'morocco': 'Morocco',
    'tunisia': 'Tunisia',
    'algeria': 'Algeria',
  }

  const locationLower = location.toLowerCase()

  // Try to find country in location string
  for (const [pattern, country] of Object.entries(countryPatterns)) {
    if (locationLower.includes(pattern)) {
      return country
    }
  }

  // If no match found, try to extract from common formats like "City, Country"
  const parts = location.split(',').map((p) => p.trim())
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].toLowerCase()
    for (const [pattern, country] of Object.entries(countryPatterns)) {
      if (lastPart.includes(pattern)) {
        return country
      }
    }
  }

  return null
}

function calculateRankings(totalContributions: number): {
  worldRank: number
  worldPercentile: number
  countryRank?: number
  countryPercentile?: number
} {
  // Estimated GitHub user statistics (approximations)
  // Based on general GitHub usage patterns
  const estimatedTotalUsers = 100_000_000 // ~100M GitHub users
  const estimatedActiveUsers = 40_000_000 // ~40M active users per year

  // Contribution distribution estimates (based on typical patterns)
  // These are rough estimates for ranking calculations
  const contributionRanges = [
    { min: 0, max: 50, percentile: 50 }, // Bottom 50%
    { min: 50, max: 200, percentile: 75 }, // 50-75th percentile
    { min: 200, max: 500, percentile: 85 }, // 75-85th percentile
    { min: 500, max: 1000, percentile: 92 }, // 85-92nd percentile
    { min: 1000, max: 2000, percentile: 96 }, // 92-96th percentile
    { min: 2000, max: 5000, percentile: 98 }, // 96-98th percentile
    { min: 5000, max: 10000, percentile: 99 }, // 98-99th percentile
    { min: 10000, max: Infinity, percentile: 99.9 }, // Top 0.1%
  ]

  // Calculate world percentile
  let worldPercentile = 50
  for (const range of contributionRanges) {
    if (totalContributions >= range.min && totalContributions < range.max) {
      worldPercentile = range.percentile
      break
    }
    if (totalContributions >= 10000) {
      worldPercentile = 99.9
      break
    }
  }

  // Calculate estimated rank (higher percentile = lower rank number = better)
  const worldRank = Math.ceil((estimatedActiveUsers * (100 - worldPercentile)) / 100)

  // Country rankings are typically 1-2% better than world (more competitive in tech countries)
  // This is a simplified estimation
  const countryPercentile = Math.max(0, worldPercentile - 1.5)
  const estimatedCountryUsers = 1_000_000 // Rough estimate for average country
  const countryRank = Math.ceil((estimatedCountryUsers * (100 - countryPercentile)) / 100)

  return {
    worldRank,
    worldPercentile: Math.round(worldPercentile * 10) / 10,
    countryRank,
    countryPercentile: Math.round(countryPercentile * 10) / 10,
  }
}

async function fetchGitHubData(username: string, token: string) {
  const { from, to } = getCurrentYearDates()

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        login
        name
        avatarUrl
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
          contributionYears
        }
        repositories(
          first: 100
          orderBy: { field: UPDATED_AT, direction: DESC }
          ownerAffiliations: OWNER
        ) {
          nodes {
            name
            stargazerCount
            updatedAt
            languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from,
        to,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'GitHub API error')
  }

  return data.data as UserData
}

function processLanguageData(repositories: Repository[]) {
  const languageMap = new Map<string, { size: number; color: string }>()

  repositories.forEach((repo) => {
    const currentYear = new Date().getFullYear()
    const updatedAt = new Date(repo.updatedAt)
    
    // Only count repos updated this year
    if (updatedAt.getFullYear() === currentYear) {
      repo.languages.edges.forEach((edge) => {
        const { name, color } = edge.node
        const size = edge.size

        if (languageMap.has(name)) {
          languageMap.set(name, {
            size: languageMap.get(name)!.size + size,
            color,
          })
        } else {
          languageMap.set(name, { size, color })
        }
      })
    }
  })

  return Array.from(languageMap.entries())
    .map(([name, { size, color }]) => ({ name, size, color }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
}

function calculateStreaks(contributionDays: ContributionDay[]) {
  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Sort by date
  const sortedDays = [...contributionDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate longest streak
  sortedDays.forEach((day) => {
    if (day.contributionCount > 0) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  })

  // Calculate current streak (from today backwards)
  tempStreak = 0
  for (let i = sortedDays.length - 1; i >= 0; i--) {
    const day = sortedDays[i]
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor(
      (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Only count days up to today
    if (daysDiff < 0) continue

    if (day.contributionCount > 0) {
      tempStreak++
      // If we hit a gap, break
      if (i > 0) {
        const prevDay = sortedDays[i - 1]
        const prevDayDate = new Date(prevDay.date)
        prevDayDate.setHours(0, 0, 0, 0)
        const prevDaysDiff = Math.floor(
          (today.getTime() - prevDayDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        // If there's more than 1 day gap, break the streak
        if (daysDiff - prevDaysDiff > 1) {
          break
        }
      }
      currentStreak = tempStreak
    } else {
      // If today or yesterday has no contributions, break
      if (daysDiff <= 1) {
        break
      }
    }
  }

  return { longestStreak, currentStreak }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const token = process.env.GITHUB_TOKEN

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      )
    }

    const data = await fetchGitHubData(username, token)

    if (!data.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch user location
    const location = await fetchUserLocation(username, token)
    const country = extractCountry(location)

    const { contributionsCollection, repositories } = data.user

    // Process contribution days
    const allDays: ContributionDay[] = []
    contributionsCollection.contributionCalendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        allDays.push(day)
      })
    })

    // Calculate streaks from calendar data
    const { longestStreak, currentStreak } = calculateStreaks(allDays)

    // Process languages
    const languages = processLanguageData(repositories.nodes)

    // Calculate total stars from repos updated this year
    const currentYear = new Date().getFullYear()
    const reposUpdatedThisYear = repositories.nodes.filter(
      (repo) => new Date(repo.updatedAt).getFullYear() === currentYear
    )
    const totalStars = reposUpdatedThisYear.reduce(
      (sum, repo) => sum + repo.stargazerCount,
      0
    )

    // Calculate total contributions
    const totalContributions =
      contributionsCollection.totalCommitContributions +
      contributionsCollection.totalIssueContributions +
      contributionsCollection.totalPullRequestContributions +
      contributionsCollection.totalPullRequestReviewContributions

    // Calculate rankings
    const rankings = calculateRankings(totalContributions)

    const result = {
      user: {
        login: data.user.login,
        name: data.user.name || data.user.login,
        avatarUrl: data.user.avatarUrl,
        location: location || null,
        country: country || null,
      },
      summary: {
        totalContributions,
        totalCommits: contributionsCollection.totalCommitContributions,
        totalIssues: contributionsCollection.totalIssueContributions,
        totalPullRequests: contributionsCollection.totalPullRequestContributions,
        totalReviews: contributionsCollection.totalPullRequestReviewContributions,
        longestStreak,
        currentStreak,
        totalStars,
        reposUpdated: reposUpdatedThisYear.length,
      },
      rankings: {
        world: {
          rank: rankings.worldRank,
          percentile: rankings.worldPercentile,
        },
        country: country
          ? {
              name: country,
              rank: rankings.countryRank,
              percentile: rankings.countryPercentile,
            }
          : null,
      },
      calendar: allDays,
      languages: languages.map((lang) => ({
        name: lang.name,
        color: lang.color,
        percentage: 0, // Will be calculated on frontend
      })),
    }

    // Calculate language percentages
    const totalLanguageSize = languages.reduce((sum, lang) => sum + lang.size, 0)
    result.languages = result.languages.map((lang) => {
      const langData = languages.find((l) => l.name === lang.name)
      return {
        ...lang,
        percentage: langData
          ? Math.round((langData.size / totalLanguageSize) * 100)
          : 0,
      }
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}

