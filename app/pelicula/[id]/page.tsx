import { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from "@/components/footer"
import { Play, Star, Calendar, Clock, Film, ArrowLeft, ShieldCheck, CheckCircle2, Info, Youtube, User, Ticket, Globe, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// ==========================================
// 🧠 CEREBRO CONSUMIDOR DE TMDB
// ==========================================
async function getMovieDetails(id: string) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos`, {
      next: { revalidate: 86400 } 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

// Formateador de dinero para los datos SEO
const formatMoney = (amount: number) => {
  if (!amount || amount === 0) return 'Desconocido';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

// ==========================================
// 🤖 METADATOS SEO
// ==========================================
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const movie = await getMovieDetails(params.id);
  
  if (!movie) {
    return { title: 'Película no encontrada | SportLive' }
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const tituloSeo = `Ver ${movie.title} (${year}) Online Gratis HD | Español Latino`;
  const descSeo = `¿Dónde ver ${movie.title} online? Disfruta de la película completa en español latino, castellano y subtitulada HD. Sinopsis: ${movie.overview?.substring(0, 120)}...`;
  const keywordsSeo = `ver ${movie.title} online, ${movie.title} pelicula completa, ver ${movie.title} español latino, descargar ${movie.title}, ${movie.title} hd gratis, cine online hd`;

  return {
    title: tituloSeo,
    description: descSeo,
    keywords: keywordsSeo,
    openGraph: {
      title: tituloSeo,
      description: descSeo,
      images: movie.backdrop_path ? [`${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}`] : [],
      type: "video.movie",
    }
  }
}

// ==========================================
// 🎨 DISEÑO PREMIUM & RESPONSIVE
// ==========================================
export default async function PeliculaPage(props: any) {
  const params = await props.params;
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-white font-['Outfit']">
        
        <Film className="w-16 h-16 text-slate-600 mb-4" />
        <h1 className="text-3xl font-black mb-4 uppercase tracking-widest text-center">Película no encontrada</h1>
        <Link href="/cine-estrenos" className="text-primary hover:underline font-bold">Volver al catálogo</Link>
        <Footer />
      </div>
    )
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  const backdropUrl = movie.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}` : '';
  const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : '';
  
  const director = movie.credits?.crew?.find((c: any) => c.job === "Director")?.name || "N/A";
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");

  const linkReproductor = `https://oleadatvpremium.com/SportLive/peliculas?q=${encodeURIComponent(movie.title)}`;

  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit'] overflow-x-hidden">
      >
      
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* 🌌 HERO GIGANTE ADAPTATIVO */}
        <div className="relative w-full pt-24 md:pt-0 min-h-[auto] md:h-[75vh] flex items-center md:items-end pb-8 md:pb-12">
          {backdropUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 md:opacity-40"
              style={{ backgroundImage: `url('${backdropUrl}')` }}
            ></div>
          )}
          {/* Degradados agresivos para lectura en móvil */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/95 md:via-[#080c14]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/80 md:via-transparent to-transparent"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10 flex flex-col">
            
            <Link href="/cine-estrenos" className="self-start inline-flex items-center text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase mb-6 md:mb-8 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Catálogo
            </Link>

            {/* CONTENEDOR FLEX: Columna en móvil, Fila en PC */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
              
              {/* Póster Centrado en Móvil */}
              {posterUrl ? (
                <img 
                  src={posterUrl} 
                  alt={`Póster de ${movie.title}`} 
                  className="w-48 sm:w-56 md:w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/10 shrink-0 md:-mb-24 relative z-20"
                />
              ) : (
                <div className="w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 md:-mb-24 relative z-20">
                  <Film className="w-12 h-12 text-slate-500" />
                </div>
              )}

              {/* Información Principal (Centrada en Móvil) */}
              <div className="flex-1 pb-2 flex flex-col items-center md:items-start text-center md:text-left w-full mt-4 md:mt-0">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded-lg text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-current" /> {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" /> {year}
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" /> {runtime}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-slate-300 italic font-medium text-sm md:text-lg mb-4 drop-shadow-md">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Director */}
                <div className="mb-6">
                  <span className="text-sm md:text-base text-slate-400">
                    Director: <strong className="text-white">{director}</strong>
                  </span>
                </div>

                {/* Etiquetas de Género (Ocultas si son muchas en móvil para no saturar) */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8 max-w-md md:max-w-full">
                  {movie.genres?.slice(0, 3).map((g: any) => (
                    <span key={g.id} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-900/30 border border-blue-500/30 px-3 py-1.5 rounded-md">
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* Botones Call To Action (Adaptados a ancho completo en móvil) */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:max-w-xl">
                  <Button size="lg" className="w-full sm:flex-1 py-7 md:py-8 rounded-xl md:rounded-2xl font-black text-sm md:text-base uppercase tracking-widest bg-gradient-to-r from-blue-600 to-[#00d4ff] hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/20 text-white" asChild>
                    <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                      <Play className="w-5 h-5 mr-2 fill-current" /> Reproducir Película
                    </Link>
                  </Button>
                  
                  {trailer && (
                    <Button size="lg" variant="outline" className="w-full sm:flex-1 py-7 md:py-8 rounded-xl md:rounded-2xl font-bold text-sm md:text-base uppercase tracking-widest bg-[#111827]/80 hover:bg-[#1f2937] border border-white/10 text-white hover:text-white transition-all backdrop-blur-md" asChild>
                      <Link href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-5 h-5 mr-2 text-red-500" /> Ver Tráiler
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📝 SECCIÓN SEO Y DATOS */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full mt-10 md:mt-32 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* Actores (Reparto) */}
            {cast.length > 0 && (
              <div className="bg-[#111827]/60 border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
                <h2 className="text-lg md:text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                  <User className="text-blue-400 w-5 h-5 md:w-6 md:h-6" /> Reparto Principal
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {cast.map((actor: any) => (
                    <div key={actor.name} className="flex-shrink-0 w-[75px] md:w-[90px] snap-start text-center">
                      <div className="relative h-16 w-16 md:h-20 md:w-20 mx-auto overflow-hidden rounded-full border-2 border-white/10 bg-slate-800 shadow-lg mb-3">
                        {actor.profile_path ? (
                          <img
                            src={`${TMDB_IMAGE_BASE}/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-500 text-xl font-black">
                            {actor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] md:text-[13px] font-bold text-white leading-tight mb-1 line-clamp-2">
                        {actor.name}
                      </p>
                      <p className="text-[9px] md:text-[11px] text-slate-400 leading-tight line-clamp-2">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sinopsis */}
            <div className="bg-[#111827]/60 border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-black text-white uppercase flex items-center gap-3 mb-4 md:mb-6">
                <Info className="text-blue-400 w-5 h-5 md:w-6 md:h-6" /> ¿De qué trata {movie.title}?
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {movie.overview || "Sinopsis no disponible en este momento. Ingresa al reproductor para descubrir esta increíble historia."}
              </p>
            </div>

            {/* Texto SEO Extendido */}
            <div className="bg-[#111827]/60 border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-black text-white uppercase flex items-center gap-3 mb-4 md:mb-6">
                <Play className="text-blue-400 w-5 h-5 md:w-6 md:h-6" /> ¿Dónde ver {movie.title} online gratis?
              </h2>
              <div className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed">
                <p>
                  Si estás buscando la mejor plataforma para ver <strong className="text-white">{movie.title}</strong> en español latino, castellano o subtitulada, has llegado al lugar indicado. En <strong>SportLive</strong> contamos con un catálogo extenso de VOD premium actualizado.
                </p>
                <p>
                  Haz clic en el botón de reproducción en la parte superior para acceder a los servidores oficiales. Podrás seleccionar la calidad de video (desde 720p hasta Full HD 1080p) y el idioma de tu preferencia sin interrupciones molestas.
                </p>
              </div>
            </div>
          </div>

          {/* Lateral */}
          <div className="space-y-6 md:space-y-8">
            
            {/* 📈 Datos Curiosos (Bono SEO) */}
            <div className="bg-[#111827]/60 border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                <Ticket className="text-blue-400 w-5 h-5 md:w-6 md:h-6" /> Datos de la Película
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Fecha de Estreno
                  </span>
                  <span className="text-white font-medium">{movie.release_date || 'Desconocida'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Idioma Original
                  </span>
                  <span className="text-white font-medium uppercase">{movie.original_language || 'N/A'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Presupuesto
                  </span>
                  <span className="text-emerald-400 font-medium">{formatMoney(movie.budget)}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Recaudación Total
                  </span>
                  <span className="text-emerald-400 font-medium">{formatMoney(movie.revenue)}</span>
                </li>
              </ul>
            </div>

            {/* Seguridad */}
            <div className="bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl md:rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                <ShieldCheck className="text-blue-400 w-5 h-5 md:w-6 md:h-6" /> Streaming Seguro
              </h2>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> 
                  <span><strong className="text-white">Calidad HD:</strong> Disfruta de la mejor resolución disponible sin interrupciones.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> 
                  <span><strong className="text-white">Sin Registros:</strong> No te pediremos tarjetas de crédito ni que crees cuentas.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> 
                  <span><strong className="text-white">Multi-Dispositivo:</strong> Compatible con Smart TV, PC, Android y iPhone.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}