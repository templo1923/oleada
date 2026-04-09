"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Star, Play, X, Calendar, Clock, Film, ChevronRight, Heart, Info } from "lucide-react"
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

interface MovieDetails extends Movie {
  runtime: number
  genres: Genre[]
  tagline: string
  credits?: {
    cast: Array<{ name: string; character: string; profile_path: string | null }>
    crew: Array<{ name: string; job: string }>
  }
  videos?: Array<{ key: string; type: string; site: string; name: string }>
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

const categories = [
  { id: "popular", name: "Populares" },
  { id: "now_playing", name: "En Cartelera" },
  { id: "top_rated", name: "Mejor Valoradas" },
  { id: "upcoming", name: "Proximos Estrenos" },
]

export function MoviesCatalog() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("popular")
  const [selectedGenre, setSelectedGenre] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [movieDetailsLoading, setMovieDetailsLoading] = useState(false)
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

  const fetchMovieDetails = async (movieId: number) => {
    setMovieDetailsLoading(true)
    try {
      const res = await fetch(`/api/movies/${movieId}`)
      const data = await res.json()
      setSelectedMovie(data)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setMovieDetailsLoading(false)
    }
  }

  const handleMovieClick = (movie: Movie) => {
    fetchMovieDetails(movie.id)
  }

  const toggleFavorite = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    )
  }

  const getGenreName = (genreId: number) => {
    return genres.find((g) => g.id === genreId)?.name || ""
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
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
              placeholder="Buscar peliculas..."
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
            {filteredMovies.length} peliculas encontradas
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
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleMovieClick(movie)}
                className="group relative text-left cursor-pointer"
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
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
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
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50"
          >
            Cargar Mas Peliculas
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Movie Modal */}
        {selectedMovie && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            onClick={() => setSelectedMovie(null)}
          >
            <div 
              className="relative w-full max-w-3xl rounded-2xl glass overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {movieDetailsLoading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  {/* Backdrop */}
                  {selectedMovie.backdrop_path && (
                    <div className="relative h-48 sm:h-72">
                      <Image
                        src={`${TMDB_IMAGE_BASE}/w1280${selectedMovie.backdrop_path}`}
                        alt={selectedMovie.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg glass text-foreground hover:bg-secondary transition-colors z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Content */}
                  <div className="relative p-6 -mt-24">
                    <div className="flex gap-4 sm:gap-6">
                      {/* Poster */}
                      <div className="relative w-28 sm:w-40 flex-shrink-0">
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                          {selectedMovie.poster_path ? (
                            <Image
                              src={`${TMDB_IMAGE_BASE}/w500${selectedMovie.poster_path}`}
                              alt={selectedMovie.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                              <Film className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          {selectedMovie.title}
                        </h2>
                        
                        {selectedMovie.tagline && (
                          <p className="text-muted-foreground italic mt-1 text-sm">
                            &quot;{selectedMovie.tagline}&quot;
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                            <Star className="h-4 w-4 fill-current" />
                            {selectedMovie.vote_average?.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({selectedMovie.vote_count?.toLocaleString()} votos)
                          </span>
                          {selectedMovie.runtime && (
                            <span className="flex items-center gap-1 text-muted-foreground text-sm">
                              <Clock className="h-4 w-4" />
                              {formatRuntime(selectedMovie.runtime)}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-muted-foreground text-sm">
                            <Calendar className="h-4 w-4" />
                            {new Date(selectedMovie.release_date).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedMovie.genres?.map((genre) => (
                            <Badge key={genre.id} variant="secondary" className="text-xs">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Overview */}
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-foreground mb-2">Sinopsis</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {selectedMovie.overview || "Sin descripcion disponible."}
                      </p>
                    </div>

                    {/* Cast */}
                    {selectedMovie.credits?.cast && selectedMovie.credits.cast.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Reparto Principal</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {selectedMovie.credits.cast.slice(0, 8).map((actor) => (
                            <div key={actor.name} className="flex-shrink-0 text-center">
                              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                                {actor.profile_path ? (
                                  <Image
                                    src={`${TMDB_IMAGE_BASE}/w185${actor.profile_path}`}
                                    alt={actor.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-lg font-semibold">
                                    {actor.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">
                                {actor.name}
                              </p>
                              <p className="max-w-[80px] truncate text-xs text-muted-foreground">
                                {actor.character}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Director */}
                    {selectedMovie.credits?.crew && (
                      <div className="mt-4">
                        <span className="text-sm text-muted-foreground">
                          Director:{" "}
                          <span className="text-foreground font-medium">
                            {selectedMovie.credits.crew.find((c) => c.job === "Director")?.name || "N/A"}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Button 
                        className="flex-1 sm:flex-none bg-gradient-to-r from-accent to-destructive text-background font-semibold py-6 shine glow-orange hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        onClick={() => {
                           // El usuario cae en la trampa y es llevado a tu catálogo real
                           window.open(`https://oleadatvpremium.com/SportLive/peliculas.html?q=${encodeURIComponent(selectedMovie.title)}`, "_blank")
                        }}
                      >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Ver Película Ahora
                      </Button>
                      
                      {selectedMovie.videos?.find((v) => v.type === "Trailer" && v.site === "YouTube") && (
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none py-6"
                          onClick={() => {
                            const trailer = selectedMovie.videos?.find(
                              (v) => v.type === "Trailer" && v.site === "YouTube"
                            )
                            if (trailer) {
                              window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")
                            }
                          }}
                        >
                          <Info className="mr-2 h-5 w-5" />
                          Ver Trailer
                        </Button>
                      )}

                      <Button variant="ghost" size="icon" className="h-12 w-12">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
