import { NextResponse } from "next/server"

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY
const FOOTBALL_BASE_URL = "https://v3.football.api-sports.io"

// Ligas principales con sus IDs
const MAIN_LEAGUES = {
  "La Liga": 140,
  "Premier League": 39,
  "Serie A": 135,
  "Bundesliga": 78,
  "Ligue 1": 61,
  "Champions League": 2,
  "Europa League": 3,
  "Copa Libertadores": 13,
  "Liga MX": 262,
  "MLS": 253,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "live"
  const league = searchParams.get("league") || ""
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  // Si no hay API key, devolver datos de demostración
  if (!FOOTBALL_API_KEY) {
    return NextResponse.json(getDemoMatches(date))
  }

  try {
    let endpoint = ""
  const headers = {
      "x-apisports-key": FOOTBALL_API_KEY,
      "x-apisports-host": "v3.football.api-sports.io",
    }

    switch (type) {
      case "live":
        endpoint = `/fixtures?live=all`
        break
      case "today":
        endpoint = `/fixtures?date=${date}`
        break
      case "upcoming":
        endpoint = `/fixtures?date=${date}&status=NS`
        break
      default:
        endpoint = `/fixtures?date=${date}`
    }

    if (league && MAIN_LEAGUES[league as keyof typeof MAIN_LEAGUES]) {
      endpoint += `&league=${MAIN_LEAGUES[league as keyof typeof MAIN_LEAGUES]}`
    }

    const response = await fetch(`${FOOTBALL_BASE_URL}${endpoint}`, {
      headers,
      next: { revalidate: 60 },
    })
    const data = await response.json()

    // Transformar datos al formato de nuestra app
    const matches = data.response?.map((fixture: any) => ({
      id: fixture.fixture.id,
      homeTeam: {
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo,
        score: fixture.goals.home,
      },
      awayTeam: {
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo,
        score: fixture.goals.away,
      },
      league: {
        name: fixture.league.name,
        logo: fixture.league.logo,
        country: fixture.league.country,
      },
      status: fixture.fixture.status.short,
      statusLong: fixture.fixture.status.long,
      elapsed: fixture.fixture.status.elapsed,
      date: fixture.fixture.date,
      venue: fixture.fixture.venue?.name,
      isLive: ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(fixture.fixture.status.short),
    })) || []

    return NextResponse.json({ matches, total: matches.length })
  } catch (error) {
    console.error("Football API Error:", error)
    return NextResponse.json(getDemoMatches(date))
  }
}

function getDemoMatches(date: string) {
  // Datos de demostración basados en partidos reales típicos
  const demoMatches = [
    {
      id: 1,
      homeTeam: { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png", score: 2 },
      awayTeam: { name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png", score: 1 },
      league: { name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png", country: "Spain" },
      status: "LIVE",
      statusLong: "En Vivo",
      elapsed: 67,
      date: new Date().toISOString(),
      venue: "Santiago Bernabéu",
      isLive: true,
    },
    {
      id: 2,
      homeTeam: { name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png", score: 0 },
      awayTeam: { name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png", score: 0 },
      league: { name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png", country: "England" },
      status: "1H",
      statusLong: "Primer Tiempo",
      elapsed: 23,
      date: new Date().toISOString(),
      venue: "Etihad Stadium",
      isLive: true,
    },
    {
      id: 3,
      homeTeam: { name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png", score: null },
      awayTeam: { name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png", score: null },
      league: { name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png", country: "Germany" },
      status: "NS",
      statusLong: "No Iniciado",
      elapsed: null,
      date: new Date(Date.now() + 3600000).toISOString(),
      venue: "Allianz Arena",
      isLive: false,
    },
    {
      id: 4,
      homeTeam: { name: "Juventus", logo: "https://media.api-sports.io/football/teams/496.png", score: null },
      awayTeam: { name: "AC Milan", logo: "https://media.api-sports.io/football/teams/489.png", score: null },
      league: { name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png", country: "Italy" },
      status: "NS",
      statusLong: "No Iniciado",
      elapsed: null,
      date: new Date(Date.now() + 7200000).toISOString(),
      venue: "Allianz Stadium",
      isLive: false,
    },
    {
      id: 5,
      homeTeam: { name: "PSG", logo: "https://media.api-sports.io/football/teams/85.png", score: 3 },
      awayTeam: { name: "Marseille", logo: "https://media.api-sports.io/football/teams/81.png", score: 1 },
      league: { name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png", country: "France" },
      status: "FT",
      statusLong: "Finalizado",
      elapsed: 90,
      date: new Date(Date.now() - 3600000).toISOString(),
      venue: "Parc des Princes",
      isLive: false,
    },
    {
      id: 6,
      homeTeam: { name: "Boca Juniors", logo: "https://media.api-sports.io/football/teams/451.png", score: null },
      awayTeam: { name: "River Plate", logo: "https://media.api-sports.io/football/teams/435.png", score: null },
      league: { name: "Copa Libertadores", logo: "https://media.api-sports.io/football/leagues/13.png", country: "South America" },
      status: "NS",
      statusLong: "No Iniciado",
      elapsed: null,
      date: new Date(Date.now() + 10800000).toISOString(),
      venue: "La Bombonera",
      isLive: false,
    },
  ]

  return { matches: demoMatches, total: demoMatches.length, isDemo: true }
}
