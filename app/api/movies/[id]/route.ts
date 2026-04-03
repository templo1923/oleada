import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "2fea686c3b99e970961f4e7d0217a448"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const [movieRes, creditsRes, videosRes] = await Promise.all([
      fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=es-ES`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=es-ES`,
        { next: { revalidate: 3600 } }
      ),
    ])

    const movie = await movieRes.json()
    const credits = await creditsRes.json()
    const videos = await videosRes.json()

    return NextResponse.json({
      ...movie,
      credits,
      videos: videos.results,
    })
  } catch (error) {
    console.error("TMDB Movie Details API Error:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
