const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL con fecha dinámica para asegurar que siempre encuentre partidos de "HOY"
const hoy = new Date().toISOString().split('T')[0].split('-').reverse().join('/'); 
const SCORES_API = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=${hoy}&endDate=${hoy}&showOdds=true&onlyMajorGames=true&withTop=true`;

async function generarPost() {
  try {
    console.log("📡 Consultando partidos para la fecha:", hoy);
    const response = await axios.get(SCORES_API);
    
    // Verificación de seguridad de la respuesta
    if (!response.data || !Array.isArray(response.data.games)) {
      console.log("⚠️ La API no devolvió una lista de juegos válida.");
      return;
    }

    const games = response.data.games;
    console.log(`✅ Se encontraron ${games.length} partidos potenciales.`);

    let postsNuevos = [];

    for (const game of games) {
      // VALIDACIÓN TOTAL: Verificamos cada campo antes de usarlo
      const homeTeamName = game.homeTeam?.name;
      const awayTeamName = game.awayTeam?.name;
      const competitionName = game.competition?.name || "Torneo destacado";

      if (!homeTeamName || !awayTeamName) {
        console.log("⏭️ Saltando partido: Datos incompletos (Local o Visitante ausente).");
        continue; 
      }

      const titulo = `${homeTeamName} vs ${awayTeamName}`;
      console.log(`✍️ Procesando contenido para: ${titulo}...`);
      
      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Eres un periodista deportivo de SportLive. Escribe una previa emocionante de 130 palabras para el partido ${titulo} en la ${competitionName}. Di que la señal HD está en nuestra agenda oficial. Usa un tono de urgencia para atraer clics.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
        });

        if (aiRes.data?.choices?.[0]?.message?.content) {
          postsNuevos.push({
            id: game.id || Math.random(),
            slug: titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-'),
            title: titulo,
            competition: competitionName,
            content: aiRes.data.choices[0].message.content,
            date: new Date().toISOString()
          });
          console.log(`✨ Post listo para: ${titulo}`);
        }
      } catch (aiError) {
        console.error(`❌ Error en Groq para ${titulo}:`, aiError.message);
      }

      // Máximo 8 posts para no saturar tu blog de una sola vez
      if (postsNuevos.length >= 8) break;
    }

    if (postsNuevos.length > 0) {
      // Aseguramos que la carpeta data exista en el runner de GitHub
      if (!fs.existsSync('./data')) { fs.mkdirSync('./data'); }
      
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
      console.log("🚀 ÉXITO: Archivo data/eventos-auto.json actualizado con", postsNuevos.length, "partidos.");
    } else {
      console.log("ℹ️ No se generaron posts (quizás no había partidos importantes con nombres definidos).");
    }

  } catch (error) {
    console.error("🚫 ERROR GENERAL:", error.message);
  }
}

generarPost();