import { NextRequest, NextResponse } from 'next/server'

// In-memory counter (in production, use a database)
let searchCount = 0

export async function GET() {
  return NextResponse.json({ count: searchCount })
}

export async function POST() {
  searchCount++
  return NextResponse.json({ count: searchCount, success: true })
}

