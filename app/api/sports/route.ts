import { NextResponse } from "next/server"

const API_KEY = process.env.FOOTBALL_API_KEY || process.env.SPORTS_API_KEY
const REVALIDATE_TIME = 3600; // 1 hora en segundos

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport") || "football"
  const date = new Date().toISOString().split("T")[0]

  try {
    let baseUrl = ""
    let endpoint = ""

    // Selección de base de datos según el deporte
    switch (sport) {
      case "nba":
        baseUrl = "https://v2.nba.api-sports.io"
        endpoint = `/games?date=${date}`
        break
      case "f1":
        baseUrl = "https://v1.formula-1.api-sports.io"
        endpoint = `/races?type=race&next=5`
        break
      case "mma":
        baseUrl = "https://v1.mma.api-sports.io"
        endpoint = `/fights?date=${date}`
        break
      default:
        baseUrl = "https://v3.football.api-sports.io"
        endpoint = `/fixtures?date=${date}&league=239,140,39,2,13,11` // Ligas VIP
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        "x-apisports-key": API_KEY || "",
        "x-apisports-host": baseUrl.replace("https://", ""),
      },
      next: { revalidate: REVALIDATE_TIME },
    })

    const data = await response.json()
    const rawFixtures = data.response || []

    // 🚀 ADAPTADOR UNIVERSAL: Moldea los datos para que el Frontend no colapse
    const formattedMatches = rawFixtures.map((item: any) => {
      const isFootball = sport === 'football';
      const isNBA = sport === 'nba';

      // Extracción segura de datos básicos
      const id = item?.fixture?.id || item?.id || Math.random();
      const matchDate = item?.fixture?.date || item?.date || new Date().toISOString();
      const status = item?.fixture?.status?.short || item?.status?.short || item?.status || "NS";
      const isLive = ["1H", "2H", "HT", "LIVE", "Q1", "Q2", "Q3", "Q4", "Live"].includes(status);

      // Extracción segura de equipos
      let homeTeam = { name: "Local", logo: "", score: null };
      let awayTeam = { name: "Visitante", logo: "", score: null };
      let league = { name: "Torneo", logo: "" };

      if (isFootball) {
        homeTeam = { name: item.teams?.home?.name, logo: item.teams?.home?.logo, score: item.goals?.home };
        awayTeam = { name: item.teams?.away?.name, logo: item.teams?.away?.logo, score: item.goals?.away };
        league = { name: item.league?.name, logo: item.league?.logo };
      } else if (isNBA) {
        homeTeam = { name: item.teams?.home?.name, logo: item.teams?.home?.logo, score: item.scores?.home?.total };
        awayTeam = { name: item.teams?.away?.name, logo: item.teams?.away?.logo, score: item.scores?.away?.total };
        league = { name: item.league?.name, logo: item.league?.logo };
      } else {
        // Fallback para F1 o MMA (No tienen 2 equipos)
        homeTeam = { name: item.competition?.name || "Evento", logo: item.competition?.logo || "", score: null };
        awayTeam = { name: item.circuit?.name || "Sede", logo: item.circuit?.image || "", score: null };
        league = { name: sport.toUpperCase(), logo: "" };
      }

      return {
        id, date: matchDate, status, isLive, elapsed: item?.fixture?.status?.elapsed || null,
        homeTeam, awayTeam, league
      }
    });

    // Tiempos de actualización para SEO
    const now = Date.now()
    const updateInfo = {
      lastUpdate: new Date(now).toLocaleTimeString("es-CO", { timeZone: "America/Bogota" }),
      nextUpdate: new Date(now + REVALIDATE_TIME * 1000).toLocaleTimeString("es-CO", { timeZone: "America/Bogota" })
    }

    return NextResponse.json({ 
      matches: formattedMatches, 
      updateInfo 
    })

  } catch (error) {
    return NextResponse.json({ error: "Error en la matriz deportiva" }, { status: 500 })
  }
}
