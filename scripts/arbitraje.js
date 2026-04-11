const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function ejecutarFinal() {
  try {
    if (!GROQ_API_KEY) {
      console.log("❌ ERROR: La clave GROQ_API_KEY no existe en GitHub Secrets.");
      return;
    }

    console.log("📡 Conectando con 365Scores...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    let listado = [];

    // Ligas que sí dan dinero (Filtro Pro)
    const tops = ["LaLiga", "Premier", "Serie A", "Bundesliga", "Ligue 1", "BetPlay", "Libertadores", "Champions", "Argentina", "MX"];

    for (const j of juegos) {
      const local = j.homeCompetitor?.name;
      const visita = j.awayCompetitor?.name;
      const liga = j.competitionDisplayName || "";
      
      // Si no es liga TOP, lo ignoramos para no gastar IA en partidos basura
      const esInteresante = tops.some(t => liga.includes(t));
      if (!esInteresante) continue;

      console.log(`✍️ Redactando: ${local} vs ${visita}...`);

      try {
        const ai = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Analista deportivo SportLive. Escribe 150 palabras emocionantes sobre ${local} vs ${visita} (${liga}). Di que la señal 4K está en nuestra Agenda SportLive.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
        });

        listado.push({
          id: j.id,
          slug: `${local}-vs-${visita}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `🔥 ${local} vs ${visita} EN VIVO`,
          content: ai.data.choices[0].message.content,
          date: new Date().toISOString()
        });
        console.log(`✅ ¡Éxito con ${local}!`);
      } catch (errorIA) {
        console.log(`❌ Error de IA: ${errorIA.response?.data?.error?.message || errorIA.message}`);
      }
      
      if (listado.length >= 5) break;
    }

    if (listado.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(listado, null, 2));
      console.log("🚀 ARCHIVO GENERADO CON ÉXITO.");
    } else {
      console.log("ℹ️ No hay partidos de ligas TOP ahora mismo.");
    }

  } catch (err) {
    console.log("Error crítico: " + err.message);
  }
}
ejecutarFinal();