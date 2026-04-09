"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Film, ChevronRight, Play, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  overview: string
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

export function MoviesSection() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies?category=popular")
        if (response.ok) {
          const data = await response.json()
          setMovies(data.results?.slice(0, 10) || [])
        }
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMovies()
  }, [])

  return (
    <section className="py-16 lg:py-24 section-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-destructive glow-orange">
                <Film className="h-5 w-5 text-background" />
              </div>
              <span className="text-sm font-medium text-accent uppercase tracking-wider">Cine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Peliculas en Tendencia</h2>
            <p className="mt-2 text-muted-foreground">Los estrenos mas populares del momento</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href="/cine-estrenos">
              Ver Catalogo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Movies Carousel */}
        <div className="relative">
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[180px] sm:w-[200px]">
                  <Skeleton className="aspect-[2/3] rounded-xl" />
                  <Skeleton className="h-4 w-3/4 mt-3" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {movies.map((movie, index) => (
                // 🔥 ENLACE ACTUALIZADO HACIA LA RUTA SEO DINÁMICA 🔥
                <Link
                  key={movie.id}
                  href={`/pelicula/${movie.id}`}
                  className="group relative flex-shrink-0 w-[180px] sm:w-[200px] snap-start block"
                >
                  {/* Poster */}
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden glass card-hover">
                    {movie.poster_path ? (
                      <Image
                        src={`${TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 180px, 200px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                        <Film className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Rank Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/70 text-foreground text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 text-accent text-xs font-semibold">
                        <Star className="h-3 w-3 fill-current" />
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-background glow-green">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
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

          {/* Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Empty State */}
        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay peliculas disponibles en este momento.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-accent to-destructive text-background font-semibold shine glow-orange hover:opacity-90 transition-opacity"
            asChild
          >
            <Link href="/cine-estrenos">
              <Film className="mr-2 h-5 w-5" />
              Explorar Catalogo Completo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}