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

/**
 * Calculates user rankings based on commit statistics
 * Uses a reference model based on GitHub commit distribution patterns
 * 
 * Reference thresholds (based on commits/year):
 * - 5000+ commits = Top 0.5%
 * - 2000+ commits = Top 1%
 * - 1000+ commits = Top 2%
 * - 500+ commits = Top 5%
 * - 200+ commits = Top 20%
 * - 50+ commits = Top 50%
 * - < 50 commits = Top 80%
 * 
 * Note: This is an estimation and not backed by any reliable data.
 * 
 * @param commits - Number of commits for the year
 * @returns Object containing world and country rankings with percentiles
 */
function calculateRankings(commits: number): {
  worldRank: number
  worldPercentile: number
  countryRank?: number
  countryPercentile?: number
} {
  // Estimated GitHub user statistics
  // Based on GitHub's reported user base and active contribution patterns
  const estimatedTotalUsers = 100_000_000 // ~100M total GitHub users
  const estimatedActiveUsers = 40_000_000 // ~40M users with contributions this year

  // Calculate percentile based on reference model
  // "Top X%" means you're in the top X% of users
  // Percentile = 100 - X (where X is the "Top X%" value)
  // Higher percentile = better ranking
  let worldPercentile: number

  if (commits >= 5000) {
    // Top 0.5%: 5000+ commits → percentile 99.5-100
    worldPercentile = 99.5 + Math.min(0.5, (commits - 5000) / 10000 * 0.5)
  } else if (commits >= 2000) {
    // Top 1%: 2000-5000 commits → percentile 99-99.5
    worldPercentile = 99 + ((commits - 2000) / 3000) * 0.5
  } else if (commits >= 1000) {
    // Top 2%: 1000-2000 commits → percentile 98-99
    worldPercentile = 98 + ((commits - 1000) / 1000) * 1
  } else if (commits >= 500) {
    // Top 5%: 500-1000 commits → percentile 95-98
    worldPercentile = 95 + ((commits - 500) / 500) * 3
  } else if (commits >= 200) {
    // Top 20%: 200-500 commits → percentile 80-95
    worldPercentile = 80 + ((commits - 200) / 300) * 15
  } else if (commits >= 50) {
    // Top 50%: 50-200 commits → percentile 50-80
    worldPercentile = 50 + ((commits - 50) / 150) * 30
  } else if (commits > 0) {
    // Top 80%: 1-50 commits → percentile 20-50
    // "Top 80%" means 80% are below you, so percentile = 20
    worldPercentile = 20 + ((commits - 1) / 49) * 30
  } else {
    // Bottom 20%: 0 commits → percentile 0-20
    worldPercentile = 10
  }

  // Ensure percentile is within valid range
  worldPercentile = Math.max(0, Math.min(100, worldPercentile))

  // Calculate estimated rank
  // Rank = number of users with better (higher) commit counts
  // Lower rank number = better position
  // Top X% means X% of users are below you, so (100 - percentile)% are above
  const worldRank = Math.max(1, Math.ceil((estimatedActiveUsers * (100 - worldPercentile)) / 100))

  // Country rankings calculation
  // Assumes country has a subset of active users with similar distribution
  // Tech-heavy countries may have slightly higher average commits
  const estimatedCountryUsers = 1_000_000 // Average estimate for countries with significant GitHub presence
  
  // Country percentile is typically 0.5-2% better (higher) than world percentile
  // This accounts for regional variations in developer activity
  const countryPercentileAdjustment = Math.min(2, worldPercentile * 0.02)
  const countryPercentile = Math.min(100, worldPercentile + countryPercentileAdjustment)
  
  const countryRank = Math.max(1, Math.ceil((estimatedCountryUsers * (100 - countryPercentile)) / 100))

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

    // Calculate rankings based on commits (primary metric)
    const commitCount = contributionsCollection.totalCommitContributions
    const rankings = calculateRankings(commitCount)
    
    // Debug: Log commit count and calculated percentile
    console.log(`[Ranking] User: ${username}, Commits: ${commitCount}, Percentile: ${rankings.worldPercentile}%`)

    // Extract country ranking values with proper type checking
    const countryRank = rankings.countryRank ?? 0
    const countryPercentile = rankings.countryPercentile ?? 0

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
          topPercent: Math.max(0.1, 100 - rankings.worldPercentile),
        },
        country: country && countryRank > 0 && countryPercentile > 0
          ? {
              name: country,
              rank: countryRank,
              percentile: countryPercentile,
              topPercent: Math.max(0.1, 100 - countryPercentile),
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

