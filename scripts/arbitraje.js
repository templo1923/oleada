const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL con la fecha de hoy 10 de abril para asegurar que hay datos
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function ejecutarArbitraje() {
  try {
    if (!GROQ_API_KEY) {
      console.log("❌ ERROR CRÍTICO: No se detecta la llave GROQ_API_KEY en los secretos de GitHub.");
      return;
    }

    console.log("📡 Conectando con 365Scores...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    let noticiasGuardadas = [];

    // Filtro de ligas que atraen tráfico real (Arbitraje Pro)
    const ligasInteresantes = ["LaLiga", "Premier", "Serie A", "Bundesliga", "Ligue 1", "BetPlay", "Libertadores", "Champions", "Argentina", "MX"];

    for (const j of juegos) {
      const local = j.homeCompetitor?.name;
      const visita = j.awayCompetitor?.name;
      const liga = j.competitionDisplayName || "";

      // Solo procesamos si es una liga que la gente busca
      const esTop = ligasInteresantes.some(t => liga.includes(t));
      if (!esTop) continue;

      console.log(`✍️ Creando noticia para: ${local} vs ${visita}...`);

      try {
        // Petición corregida según estándar de Groq
        const ai = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Eres un analista de SportLive. Escribe una previa explosiva de 140 palabras para el partido ${local} vs ${visita} de la ${liga}. Incluye un titular con emojis y menciona que la señal 4K está disponible en nuestra Agenda Deportiva SportLive.`
          }]
        }, {
          headers: { 
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        noticiasGuardadas.push({
          id: j.id,
          slug: `${local}-vs-${visita}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `🔥 EN VIVO: ${local} vs ${visita}`,
          content: ai.data.choices[0].message.content,
          date: new Date().toISOString()
        });
        
        console.log(`✅ ¡Misión cumplida con ${local}!`);
      } catch (eIA) {
        // Aquí verás el error real si Groq falla
        console.log(`❌ Error de IA en este partido: ${eIA.response?.data?.error?.message || eIA.message}`);
      }

      if (noticiasGuardadas.length >= 5) break;
    }

    if (noticiasGuardadas.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticiasGuardadas, null, 2));
      console.log("🚀 ARCHIVO ACTUALIZADO CON ÉXITO.");
    } else {
      console.log("ℹ️ No se detectaron partidos de ligas TOP en este horario.");
    }

  } catch (err) {
    console.log("🚫 Error general: " + err.message);
  }
}

ejecutarArbitraje();