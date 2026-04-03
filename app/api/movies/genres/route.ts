import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "2fea686c3b99e970961f4e7d0217a448"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`,
      { next: { revalidate: 86400 } }
    )
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("TMDB Genres API Error:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}
