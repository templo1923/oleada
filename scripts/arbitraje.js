const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL con parámetros para asegurar que traiga datos de hoy
const SCORES_API = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&showOdds=true&onlyMajorGames=true&withTop=true";

async function generarPost() {
  try {
    console.log("📡 Conectando con 365Scores...");
    const response = await axios.get(SCORES_API);
    
    if (!response.data || !response.data.games) {
      console.log("⚠️ No se encontraron partidos activos en la API.");
      return;
    }

    const games = response.data.games;
    console.log(`✅ Se detectaron ${games.length} partidos.`);

    let postsNuevos = [];

    for (const game of games) {
      // VALIDACIÓN CRÍTICA: Verificamos que existan los equipos antes de leer el nombre
      const homeName = game.homeTeam?.name;
      const awayName = game.awayTeam?.name;
      const competition = game.competition?.name || "Torneo Internacional";

      if (!homeName || !awayName) {
        console.log("⏭️ Saltando partido: Datos de equipo incompletos.");
        continue; 
      }

      const titulo = `${homeName} vs ${awayName}`;
      console.log(`✍️ Redactando post para: ${titulo}...`);
      
      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Eres un periodista deportivo de SportLive. Escribe una previa SEO breve (120 palabras) para el partido ${titulo} en la ${competition}. Usa un tono de urgencia. Di que la señal HD está en nuestra agenda oficial. No uses links.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        postsNuevos.push({
          id: game.id,
          // Slug limpio sin tildes ni caracteres raros
          slug: titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-'),
          title: titulo,
          competition: competition,
          content: aiRes.data.choices[0].message.content,
          date: new Date().toISOString()
        });

        console.log(`✨ Post guardado: ${titulo}`);
      } catch (aiError) {
        console.error(`❌ Error de Groq en ${titulo}:`, aiError.message);
      }

      // Límite de 5 posts para no saturar
      if (postsNuevos.length >= 5) break;
    }

    if (postsNuevos.length > 0) {
      // Asegurar que la carpeta data existe
      if (!fs.existsSync('./data')) { fs.mkdirSync('./data'); }
      
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
      console.log("🚀 ARCHIVO ACTUALIZADO: data/eventos-auto.json listo.");
    }

  } catch (error) {
    console.error("🚫 ERROR CRÍTICO:", error.message);
  }
}

generarPost();