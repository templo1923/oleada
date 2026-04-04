import { NextResponse } from "next/server"

const API_KEY = process.env.FOOTBALL_API_KEY || process.env.SPORTS_API_KEY
const REVALIDATE_TIME = 1800; // 30 min cache para no agotar la API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport") || "football"
  const date = new Date().toISOString().split("T")[0]

  try {
    let baseUrl = ""
    let endpoint = ""

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
        endpoint = `/fixtures?date=${date}` // Trae TODO para SEO
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

    const formattedMatches = rawFixtures.map((item: any) => {
      const id = item?.fixture?.id || item?.id || Math.random();
      const matchDate = item?.fixture?.date || item?.date || new Date().toISOString();
      const status = item?.fixture?.status?.short || item?.status?.short || item?.status || "NS";
      const isLive = ["1H", "2H", "HT", "LIVE", "Q1", "Q2", "Q3", "Q4", "Live"].includes(status);

      let homeTeam = { name: "Local", logo: "", score: null };
      let awayTeam = { name: "Visitante", logo: "", score: null };
      let league = { name: "Torneo", logo: "" };

      if (sport === 'football') {
        homeTeam = { name: item.teams?.home?.name, logo: item.teams?.home?.logo, score: item.goals?.home ?? null };
        awayTeam = { name: item.teams?.away?.name, logo: item.teams?.away?.logo, score: item.goals?.away ?? null };
        league = { name: item.league?.name, logo: item.league?.logo };
      } else if (sport === 'nba') {
        homeTeam = { name: item.teams?.home?.name, logo: item.teams?.home?.logo, score: item.scores?.home?.total ?? null };
        awayTeam = { name: item.teams?.away?.name, logo: item.teams?.away?.logo, score: item.scores?.away?.total ?? null };
        league = { name: item.league?.name || "NBA", logo: item.league?.logo || "" };
      } else if (sport === 'f1') {
        homeTeam = { name: item.competition?.name || "Carrera", logo: item.competition?.logo || "", score: null };
        awayTeam = { name: item.circuit?.name || "Sede", logo: item.circuit?.image || "", score: null };
        league = { name: "Fórmula 1", logo: "" };
      } else {
        homeTeam = { name: item.fighters?.home?.name || "Peleador 1", logo: item.fighters?.home?.logo || "", score: null };
        awayTeam = { name: item.fighters?.away?.name || "Peleador 2", logo: item.fighters?.away?.logo || "", score: null };
        league = { name: "UFC / MMA", logo: "" };
      }

      // SLUG PARA SEO
      const slugLocal = homeTeam.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "equipo";
      const slugVisitante = awayTeam.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "equipo";
      const slug = `${slugLocal}-vs-${slugVisitante}-${id}`;

      return { id, date: matchDate, status, isLive, elapsed: item?.fixture?.status?.elapsed || null, homeTeam, awayTeam, league, slug }
    });

    const now = Date.now()
    return NextResponse.json({ 
        matches: formattedMatches, 
        updateInfo: {
            lastUpdate: new Date(now).toLocaleTimeString("es-CO", { timeZone: "America/Bogota" }),
            nextUpdate: new Date(now + REVALIDATE_TIME * 1000).toLocaleTimeString("es-CO", { timeZone: "America/Bogota" })
        }
    })
  } catch (error) {
    return NextResponse.json({ error: "Error en matriz", matches: [] }, { status: 500 })
  }
}