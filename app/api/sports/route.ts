import { NextResponse } from "next/server"

const API_KEY = process.env.FOOTBALL_API_KEY
const REVALIDATE_TIME = 1800; // 30 minutos

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport") || "football"
  
  try {
    // Definimos la URL según el deporte, pero la lógica de extracción será similar
    const hosts: any = {
      football: "v3.football.api-sports.io",
      nba: "v2.nba.api-sports.io",
      f1: "v1.formula-1.api-sports.io",
      mma: "v1.mma.api-sports.io"
    }

    const response = await fetch(`https://${hosts[sport]}/fixtures?date=${new Date().toISOString().split('T')[0]}`, {
      headers: { "x-apisports-key": API_KEY || "", "x-apisports-host": hosts[sport] },
      next: { revalidate: REVALIDATE_TIME }
    })

    const res = await response.json()
    const raw = res.response || []

    // ADAPTADOR UNIVERSAL: No importa el deporte, sacamos Título y Slug
    const matches = raw.map((item: any) => {
      const home = item.teams?.home?.name || item.fighters?.home?.name || item.competition?.name || "Evento";
      const away = item.teams?.away?.name || item.fighters?.away?.name || item.circuit?.name || "Especial";
      const id = item.fixture?.id || item.id;
      
      // El SLUG es lo que Google indexa
      const slug = `ver-${home.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-vs-${away.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-en-vivo-hoy-${id}`;

      return {
        id,
        title: `${home} vs ${away}`,
        homeName: home,
        awayName: away,
        homeLogo: item.teams?.home?.logo || "",
        awayLogo: item.teams?.away?.logo || "",
        isLive: ["1H","2H","HT","LIVE","Q1","Q2","Q3","Q4"].includes(item.fixture?.status?.short || item.status?.short),
        slug
      }
    })

    return NextResponse.json({ matches })
  } catch (e) {
    return NextResponse.json({ matches: [] })
  }
}