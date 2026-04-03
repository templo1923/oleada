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
        endpoint = `/races?type=race&next=5` // Trae las próximas 5 carreras
        break
      case "mma":
        baseUrl = "https://v1.mma.api-sports.io"
        endpoint = `/fights?date=${date}`
        break
      default:
        baseUrl = "https://v3.football.api-sports.io"
        endpoint = `/fixtures?date=${date}&league=239,140,39,2,13` // Ligas VIP
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        "x-apisports-key": API_KEY || "",
        "x-apisports-host": baseUrl.replace("https://", ""),
      },
      next: { revalidate: REVALIDATE_TIME },
    })

    const data = await response.json()
    
    // Tiempos de actualización para el Frontend
    const now = Date.now()
    const updateInfo = {
      lastUpdate: new Date(now).toLocaleTimeString("es-CO"),
      nextUpdate: new Date(now + REVALIDATE_TIME * 1000).toLocaleTimeString("es-CO")
    }

    return NextResponse.json({ 
      data: data.response || [], 
      updateInfo 
    })

  } catch (error) {
    return NextResponse.json({ error: "Error en la matriz deportiva" }, { status: 500 })
  }
}
