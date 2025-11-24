# GitHub Wrapped

A beautiful "Year in Code" summary for GitHub users, built with Next.js and TailwindCSS. Discover your GitHub contribution statistics, streaks, top languages, and more for the current year.

![GitHub Wrapped](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8?logo=tailwind-css)

## Features

- 📊 **Comprehensive Statistics**: Total contributions, commits, PRs, issues, and code reviews
- 🔥 **Contribution Streaks**: Track your longest and current contribution streaks
- 📅 **Calendar Heatmap**: Visual representation of your daily contributions
- 💻 **Top Languages**: See which programming languages you used most this year
- ⭐ **Repository Stats**: Stars received and repos updated this year
- 📸 **Export Functionality**: Download a shareable image of your wrapped summary
- 🎨 **Beautiful Design**: Modern, responsive UI with gradient backgrounds and smooth animations

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A GitHub Personal Access Token with `public_repo` and `read:user` scopes

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/eminemahjoub/GitHubwrapped.git
cd GitHubwrapped
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your GitHub Personal Access Token:

```
GITHUB_TOKEN=your_github_token_here
```

**How to get a GitHub Personal Access Token:**
1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "GitHub Wrapped")
4. Select scopes: `public_repo` and `read:user`
5. Click "Generate token"
6. Copy the token and paste it into your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
github-wrapped/
├── app/
│   ├── api/
│   │   └── wrapped/
│   │       └── route.ts          # API route for GitHub GraphQL queries
│   ├── globals.css                # Global styles with Tailwind
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── components/
│   ├── CalendarHeatmap.tsx       # Contribution calendar visualization
│   ├── ErrorDisplay.tsx          # Error message component
│   ├── InputForm.tsx             # Username input form
│   ├── LanguageChart.tsx         # Top languages bar chart
│   ├── Loader.tsx                # Loading spinner
│   ├── StatsCard.tsx             # Statistics card component
│   └── SummaryPage.tsx           # Main summary page with export
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## API Endpoint

The app uses a Next.js API route at `/api/wrapped` that accepts a `username` query parameter:

```
GET /api/wrapped?username=octocat
```

The API route:
- Fetches data from GitHub GraphQL API
- Processes contributions for the current year (Jan 1 - Dec 31)
- Calculates streaks, languages, and statistics
- Returns a JSON response with all the wrapped data

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `GITHUB_TOKEN` as an environment variable in Vercel settings
4. Deploy!

Vercel will automatically detect Next.js and configure everything for you.

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add `GITHUB_TOKEN` as an environment variable in Netlify settings
6. Deploy!

### Environment Variables for Deployment

Make sure to set the `GITHUB_TOKEN` environment variable in your deployment platform:
- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Recharts**: React charting library for language visualization
- **html2canvas**: Export summary as image
- **GitHub GraphQL API**: Fetching user contribution data

## How It Works

1. User enters their GitHub username
2. Frontend calls `/api/wrapped?username={user}`
3. API route queries GitHub GraphQL API for:
   - Contribution collection (commits, PRs, issues, reviews)
   - Contribution calendar (daily contributions)
   - Repository data (languages, stars, updates)
   - Streak information
4. Data is processed and formatted
5. Summary page displays:
   - Statistics cards
   - Calendar heatmap
   - Language chart
   - Milestone messages
6. User can export the summary as an image

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

Inspired by [git-wrapped.com](https://git-wrapped.com) and Spotify Wrapped.

---

Made with ❤️ using Next.js and TailwindCSS

