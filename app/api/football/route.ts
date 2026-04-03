import { NextResponse } from "next/server"

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || process.env.SPORTS_API_KEY
const FOOTBALL_BASE_URL = "https://v3.football.api-sports.io"

// Ligas principales VIP con sus IDs
const MAIN_LEAGUES = {
  "Liga BetPlay": 239,
  "La Liga": 140,
  "Premier League": 39,
  "Serie A": 135,
  "Bundesliga": 78,
  "Ligue 1": 61,
  "Champions League": 2,
  "Europa League": 3,
  "Copa Libertadores": 13,
  "Copa Sudamericana": 11,
  "Liga MX": 262,
  "MLS": 253,
  "Copa America": 9,
  "Euro Championship": 4
}

// Extraemos solo los números (IDs) para usarlos en el filtro
const MAIN_LEAGUE_IDS = Object.values(MAIN_LEAGUES)

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
      next: { revalidate: 60 }, // Se actualiza cada minuto
    })
    
    const data = await response.json()
    let rawFixtures = data.response || []

    // 🔥 FILTRO INTELIGENTE: Si no pidieron una liga en específico, mostramos solo las VIP
    if (!league && type !== "live") {
      rawFixtures = rawFixtures.filter((fixture: any) => 
        MAIN_LEAGUE_IDS.includes(fixture.league.id)
      )
    }

    // Transformar datos al formato de nuestra app
    const matches = rawFixtures.map((fixture: any) => ({
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

    // Ordenar para que los partidos en vivo o más próximos salgan primero
    matches.sort((a: any, b: any) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return NextResponse.json({ matches, total: matches.length })
  } catch (error) {
    console.error("Football API Error:", error)
    return NextResponse.json(getDemoMatches(date))
  }
}

function getDemoMatches(date: string) {
  // Datos de demostración
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
      homeTeam: { name: "Millonarios", logo: "https://media.api-sports.io/football/teams/1182.png", score: 0 },
      awayTeam: { name: "Atl. Nacional", logo: "https://media.api-sports.io/football/teams/1183.png", score: 0 },
      league: { name: "Liga BetPlay", logo: "https://media.api-sports.io/football/leagues/239.png", country: "Colombia" },
      status: "1H",
      statusLong: "Primer Tiempo",
      elapsed: 23,
      date: new Date().toISOString(),
      venue: "El Campín",
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
      homeTeam: { name: "River Plate", logo: "https://media.api-sports.io/football/teams/435.png", score: null },
      awayTeam: { name: "Boca Juniors", logo: "https://media.api-sports.io/football/teams/451.png", score: null },
      league: { name: "Copa Libertadores", logo: "https://media.api-sports.io/football/leagues/13.png", country: "South America" },
      status: "NS",
      statusLong: "No Iniciado",
      elapsed: null,
      date: new Date(Date.now() + 7200000).toISOString(),
      venue: "Monumental",
      isLive: false,
    }
  ]

  return { matches: demoMatches, total: demoMatches.length, isDemo: true }
}
