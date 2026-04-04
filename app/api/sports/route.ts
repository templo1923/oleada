import { NextResponse } from "next/server"

const API_KEY = process.env.FOOTBALL_API_KEY || process.env.SPORTS_API_KEY
const REVALIDATE_TIME = 3600; 

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
        endpoint = `/fixtures?date=${date}` 
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
      let homeTeam, awayTeam, league, id, matchDate, status, isLive;

      if (sport === 'football') {
        id = item.fixture.id;
        matchDate = item.fixture.date;
        status = item.fixture.status.short;
        homeTeam = { name: item.teams.home.name, logo: item.teams.home.logo, score: item.goals.home };
        awayTeam = { name: item.teams.away.name, logo: item.teams.away.logo, score: item.goals.away };
        league = { name: item.league.name, logo: item.league.logo };
      } else if (sport === 'nba') {
        id = item.id;
        matchDate = item.date.start;
        status = item.status.short;
        homeTeam = { name: item.teams.home.name, logo: item.teams.home.logo, score: item.scores.home.points };
        awayTeam = { name: item.teams.away.name, logo: item.teams.away.logo, score: item.scores.away.points };
        league = { name: "NBA", logo: "https://media.api-sports.io/basketball/leagues/12.png" };
      } else if (sport === 'f1') {
        id = item.id;
        matchDate = item.date;
        status = item.status;
        homeTeam = { name: item.competition.name, logo: item.circuit.image, score: null };
        awayTeam = { name: item.circuit.name, logo: "", score: null };
        league = { name: "Formula 1", logo: "https://media.api-sports.io/formula-1/leagues/1.png" };
      } else {
        // MMA / OTROS
        id = item.id || Math.random();
        matchDate = item.date || new Date().toISOString();
        status = item.status?.short || "NS";
        homeTeam = { name: item.fighters?.home?.name || "Fighter 1", logo: item.fighters?.home?.logo, score: null };
        awayTeam = { name: item.fighters?.away?.name || "Fighter 2", logo: item.fighters?.away?.logo, score: null };
        league = { name: "MMA / UFC", logo: "" };
      }

      isLive = ["1H", "2H", "HT", "LIVE", "Q1", "Q2", "Q3", "Q4", "Live", "Running"].includes(status);
      const slug = `${homeTeam.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-vs-${awayTeam.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`;

      return { id, date: matchDate, status, isLive, homeTeam, awayTeam, league, slug }
    });

    return NextResponse.json({ 
        matches: formattedMatches,
        updateInfo: {
            lastUpdate: new Date().toLocaleTimeString("es-CO", { timeZone: "America/Bogota" }),
            nextUpdate: new Date(Date.now() + 3600000).toLocaleTimeString("es-CO", { timeZone: "America/Bogota" })
        }
    })

  } catch (error) {
    return NextResponse.json({ error: "Error en matriz" }, { status: 500 })
  }
}