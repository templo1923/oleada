const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Usamos una fecha estática para hoy según el formato de la API
const hoy = new Date().toLocaleDateString('es-CO', {timeZone: 'America/Bogota'}).split('/').join('/');
const SCORES_API = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=${hoy}&endDate=${hoy}&showOdds=true&onlyMajorGames=true&withTop=true`;

async function generarPost() {
  try {
    console.log(`📡 Conectando a la API: ${SCORES_API}`);
    const response = await axios.get(SCORES_API);
    
    const games = response.data?.games;
    if (!games || !Array.isArray(games)) {
      console.log("❌ No se encontraron juegos en el formato esperado.");
      return;
    }

    console.log(`✅ Se detectaron ${games.length} partidos potenciales.`);
    let postsNuevos = [];

    for (const game of games) {
      // EXTRACCIÓN CON VALIDACIÓN NIVEL POR NIVEL (Para evitar el error de 'reading name')
      let local = "Equipo Local";
      let visitante = "Equipo Visitante";

      // Intentar sacar nombre de homeCompetitor
      if (game.homeCompetitor && game.homeCompetitor.name) {
        local = game.homeCompetitor.name;
      } else if (game.competitors && game.competitors[0] && game.competitors[0].name) {
        local = game.competitors[0].name;
      }

      // Intentar sacar nombre de awayCompetitor
      if (game.awayCompetitor && game.awayCompetitor.name) {
        visitante = game.awayCompetitor.name;
      } else if (game.competitors && game.competitors[1] && game.competitors[1].name) {
        visitante = game.competitors[1].name;
      }

      // Si después de buscar no tenemos nombres reales, saltamos
      if (local === "Equipo Local" || visitante === "Equipo Visitante") {
        continue;
      }

      const titulo = `${local} vs ${visitante}`;
      const liga = game.competitionDisplayName || "Fútbol Internacional";

      console.log(`✍️ Enviando a IA: ${titulo}`);

      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "system",
            content: "Eres un periodista deportivo experto en SEO. Tu objetivo es atraer tráfico de redes sociales con previas emocionantes y profesionales."
          }, {
            role: "user",
            content: `Escribe una previa deportiva de aproximadamente 150 palabras para el partido ${titulo} que se juega hoy en la ${liga}. 
            
            Estructura:
            1. Un titular gancho (sin repetirlo en el cuerpo).
            2. Un análisis rápido de ambos equipos.
            3. Una invitación final clara: 'Puedes seguir este partido en vivo y en alta definición a través de nuestra Agenda SportLive, el mejor lugar para ver deportes gratis'.
            
            Importante: Usa un tono emocionante, profesional y optimizado para SEO. No incluyas enlaces externos ni el nombre del periodista.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        if (aiRes.data?.choices?.[0]?.message?.content) {
          postsNuevos.push({
            id: game.id || Math.random(),
            slug: titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-'),
            title: titulo,
            content: aiRes.data.choices[0].message.content,
            date: new Date().toISOString()
          });
          console.log(`✨ ¡Post generado!`);
        }
      } catch (err) {
        console.error("❌ Error en Groq:", err.message);
      }

      if (postsNuevos.length >= 8) break;
    }

    if (postsNuevos.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
      console.log(`🚀 FIN: Guardados ${postsNuevos.length} partidos.`);
    }

  } catch (error) {
    console.error("🚫 ERROR GENERAL:", error.message);
  }
}

generarPost();