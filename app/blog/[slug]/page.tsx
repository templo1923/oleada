import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { ArrowLeft, PlayCircle, Clock, Calendar, User } from "lucide-react";

// 💡 Importamos el JSON
import blogData from "@/data/blog-posts.json";

// 🔥 1. MAGIA SEO DINÁMICA PARA EL ARTÍCULO 🔥
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  
  // 🚨 IMPORTANTE: Buscamos dentro de blogData.posts
  const post = blogData.posts.find((p: any) => p.slug === resolvedParams.slug);

  if (!post) return { title: 'Artículo no encontrado' };

  const descCorta = post.excerpt;
  const imagenPost = post.image;

  return {
    title: post.title,
    description: descCorta,
    keywords: post.tags ? post.tags.join(", ") : "noticias deportivas, cine, estrenos, streaming",
    openGraph: {
      title: post.title,
      description: descCorta,
      url: `https://oleadatvpremium.com/blog/${resolvedParams.slug}`,
      type: "article", // 👈 Vital para que Google sepa que es una noticia
      images: [{ url: imagenPost, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: descCorta,
      images: [imagenPost],
    }
  }
}

// 📝 2. LA PÁGINA VISUAL DEL ARTÍCULO
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  
  // Buscamos el artículo en la lista de posts
  const post = blogData.posts.find((p: any) => p.slug === resolvedParams.slug);

  if (!post) {
    return notFound();
  }

  // Formatear la fecha
  const fechaPublicacion = new Date(post.publishedAt).toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#080c14]">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-4xl">
        
        {/* BOTÓN VOLVER (HACK DE SEGURIDAD) */}
        <div className="mb-8">
          <form action="/blog" method="GET" className="m-0 p-0 inline-block">
            <button type="submit" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Blog
            </button>
          </form>
        </div>

        {/* CABECERA DEL ARTÍCULO */}
        <header className="mb-10">
          <span className="inline-block bg-primary text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            {post.title}
          </h1>
          
          {/* METADATOS: Autor, Fecha y Tiempo de Lectura */}
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium border-y border-white/10 py-4 mb-8">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full border border-white/20" />
              <span className="text-white">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <time>{fechaPublicacion}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{post.readTime} min de lectura</span>
            </div>
          </div>

          {/* IMAGEN DE PORTADA */}
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-2xl border border-white/5 mb-10"
          />
        </header>

        {/* CONTENIDO DEL ARTÍCULO */}
        <div className="bg-[#111827]/60 p-6 sm:p-10 rounded-[2.5rem] border border-white/5 mb-12 backdrop-blur-sm">
          {/* El extracto resaltado arriba */}
          <p className="text-xl text-white font-medium italic mb-8 border-l-4 border-primary pl-4">
            {post.excerpt}
          </p>
          {/* El contenido principal */}
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
          
          {/* Etiquetas (Tags) */}
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-bold text-slate-400 bg-black/50 border border-white/10 px-3 py-1 rounded-full uppercase">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION (HACK NINJA PARA LA AGENDA) */}
        <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-3xl p-8 border border-primary/30 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10"></div>
          <h3 className="text-2xl font-black text-white mb-4">¿Quieres ver la mejor TV y Deportes en vivo?</h3>
          <p className="text-slate-300 mb-6">Instala nuestra App SportLive Premium totalmente gratis y sin cortes.</p>
          
          <form action="/SportLive/agenda.html" method="GET" className="m-0 p-0 inline-block">
            <button type="submit" className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.4)] cursor-pointer border-none">
              <PlayCircle className="w-6 h-6" />
              ABRIR SPORTLIVE AHORA
            </button>
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}