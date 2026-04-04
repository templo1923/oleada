"use client"

// 🚀 Este componente es tu navaja suiza para deportes
export function SportsWidget({ 
  type = "games", 
  sport = "football", 
  league, 
  id 
}: { 
  type?: string, 
  sport?: string, 
  league?: string,
  id?: string 
}) {
  return (
    <div className="w-full glass rounded-3xl overflow-hidden border border-white/5">
      {/* 1. La Configuración (Se oculta sola) */}
      <api-sports-widget
        data-type="config"
        data-key="45eebbed5de602722f24a2316ce03017" // ⚠️ Tu llave real
        data-sport={sport}
        data-theme="dark"
        data-lang="es"
        data-show-logos="true"
        data-favorite="true"
      ></api-sports-widget>

      {/* 2. El Widget real que se muestra */}
      <api-sports-widget
        data-type={type}
        data-league={league}
        data-game-id={id}
        data-refresh="15"
      ></api-sports-widget>
    </div>
  )
}