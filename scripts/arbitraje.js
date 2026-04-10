const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const hoy = new Date().toISOString().split('T')[0].split('-').reverse().join('/'); 
const SCORES_API = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=${hoy}&endDate=${hoy}&showOdds=true&onlyMajorGames=true&withTop=true`;

async function generarPost() {
  try {
    console.log(`📡 Consultando API de 365Scores para el día: ${hoy}`);
    const response = await axios.get(SCORES_API);
    
    // Accedemos a la lista de juegos
    const games = response.data?.games;

    if (!games || !Array.isArray(games)) {
      console.log("⚠️ No se encontraron juegos hoy o la API cambió la estructura.");
      return;
    }

    console.log(`✅ Se encontraron ${games.length} partidos. Iniciando procesamiento...`);
    let postsNuevos = [];

    for (const game of games) {
      // AJUSTE CLAVE: Usamos homeCompetitor y awayCompetitor según tu JSON
      const local = game.homeCompetitor?.name;
      const visitante = game.awayCompetitor?.name;
      const liga = game.competitionDisplayName || "Fútbol Internacional";

      if (!local || !visitante) {
        console.log("⏭️ Saltando un partido por datos incompletos.");
        continue;
      }

      const titulo = `${local} vs ${visitante}`;
      console.log(`✍️ Generando artículo para: ${titulo}...`);
      
      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Eres un periodista deportivo de SportLive. Escribe una previa emocionante y profesional de 130 palabras para el partido ${titulo} en la liga ${liga}. Menciona que la mejor señal HD está disponible en nuestra agenda de SportLive. Usa un tono que incite a ver el partido ahora.`
          }]
        }, {
          headers: { 
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json' 
          }
        });

        if (aiRes.data?.choices?.[0]?.message?.content) {
          postsNuevos.push({
            id: game.id,
            // Generamos slug limpio
            slug: titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-'),
            title: titulo,
            league: liga,
            content: aiRes.data.choices[0].message.content,
            startTime: game.startTime,
            date: new Date().toISOString()
          });
          console.log(`✨ ¡Post generado con éxito para ${titulo}!`);
        }
      } catch (aiError) {
        console.error(`❌ Error de Groq en ${titulo}:`, aiError.message);
      }

      // Límite de seguridad: Generamos 10 artículos por corrida
      if (postsNuevos.length >= 10) break;
    }

    if (postsNuevos.length > 0) {
      // Creamos la carpeta data si no existe (importante para GitHub Actions)
      if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
      }
      
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
      console.log(`🚀 TERMINADO: ${postsNuevos.length} partidos guardados en data/eventos-auto.json`);
    } else {
      console.log("ℹ️ No se pudo generar ningún post válido.");
    }

  } catch (error) {
    console.error("🚫 ERROR GENERAL DEL SCRIPT:", error.message);
  }
}

generarPost();