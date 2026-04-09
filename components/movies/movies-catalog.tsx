"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Star, Play, Calendar, Film, ChevronRight, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Movie {
  id: number
  title: string
  original_title: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
  overview: string
  genre_ids?: number[]
  popularity: number
}

interface Genre {
  id: number
  name: string
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

const categories = [
  { id: "popular", name: "Populares" },
  { id: "now_playing", name: "En Cartelera" },
  { id: "top_rated", name: "Mejor Valoradas" },
  { id: "upcoming", name: "Próximos Estrenos" },
]

export function MoviesCatalog() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("popular")
  const [selectedGenre, setSelectedGenre] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("/api/movies/genres")
        const data = await res.json()
        setGenres([{ id: 0, name: "Todos" }, ...(data.genres || [])])
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }
    fetchGenres()
  }, [])

  // Fetch movies when category or genre changes
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        let url = `/api/movies?category=${selectedCategory}`
        if (selectedGenre !== 0) {
          url += `&genre=${selectedGenre}`
        }
        const res = await fetch(url)
        const data = await res.json()
        setMovies(data.results || [])
        setFilteredMovies(data.results || [])
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [selectedCategory, selectedGenre])

  // Filter by search
  useEffect(() => {
    if (search) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredMovies(filtered)
    } else {
      setFilteredMovies(movies)
    }
  }, [search, movies])

  const toggleFavorite = (e: React.MouseEvent, movieId: number) => {
    e.preventDefault() // Evita que se abra la ruta de la película
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    )
  }

  const getGenreName = (genreId: number) => {
    return genres.find((g) => g.id === genreId)?.name || ""
  }

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar películas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-base glass border-border/50 focus:border-primary/50 bg-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-accent to-destructive text-background glow-orange"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.slice(0, 12).map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedGenre === genre.id
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredMovies.length} películas encontradas
          </p>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredMovies.map((movie, index) => (
              // 🔥 EL ENLACE MAESTRO HACIA LA RUTA SEO DE LA PELÍCULA 🔥
              <Link
                key={movie.id}
                href={`/pelicula/${movie.id}`}
                className="group relative text-left cursor-pointer block"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden glass card-hover">
                  {movie.poster_path ? (
                    <Image
                      src={`${TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                      <Film className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  {/* Rank */}
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/70 text-foreground text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 text-accent text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current" />
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>

                  {/* Favorite button */}
                  <button
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                    onClick={(e) => toggleFavorite(e, movie.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(movie.id) ? "fill-red-500 text-red-500" : "text-white"
                      }`}
                    />
                  </button>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-background glow-green">
                      <Play className="h-6 w-6 fill-current" />
                    </div>
                  </div>

                  {/* Genre badge */}
                  {movie.genre_ids && movie.genre_ids[0] && (
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge variant="secondary" className="text-xs bg-black/70 text-white border-0">
                        {getGenreName(movie.genre_ids[0])}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-3">
                  <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50"
            onClick={() => window.open("https://oleadatvpremium.com/SportLive/peliculas.html", "_blank")}
          >
            Explorar Catálogo Completo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </div>
    </section>
  )
}