import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "2fea686c3b99e970961f4e7d0217a448"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "popular"
  const page = searchParams.get("page") || "1"
  const genre = searchParams.get("genre") || ""

  try {
    let endpoint = ""
    
    switch (category) {
      case "popular":
        endpoint = `/movie/popular`
        break
      case "now_playing":
        endpoint = `/movie/now_playing`
        break
      case "top_rated":
        endpoint = `/movie/top_rated`
        break
      case "upcoming":
        endpoint = `/movie/upcoming`
        break
      default:
        endpoint = `/movie/popular`
    }

    let url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`
    
    if (genre) {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}&with_genres=${genre}`
    }

    const response = await fetch(url, { next: { revalidate: 3600 } })
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("TMDB API Error:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}
