const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL actualizada con parámetros más específicos para asegurar resultados
const SCORES_API = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&showOdds=true&onlyMajorGames=true&withTop=true";

async function generarPost() {
  try {
    console.log("Iniciando descarga de partidos...");
    const response = await axios.get(SCORES_API);
    
    // Verificamos que existan juegos en la respuesta
    if (!response.data || !response.data.games) {
      console.log("No se encontraron partidos en la API en este momento.");
      return;
    }

    const games = response.data.games;
    console.log(`Se encontraron ${games.length} partidos totales.`);

    let postsNuevos = [];

    // Solo procesamos si hay datos válidos
    for (const game of games) {
      // Uso de Optional Chaining (?.) para evitar el error de 'undefined'
      const homeName = game.homeTeam?.name;
      const awayName = game.awayTeam?.name;

      if (!homeName || !awayName) {
        console.log("Saltando partido por falta de nombres de equipo.");
        continue; 
      }

      const titulo = `${homeName} vs ${awayName}`;
      console.log(`Redactando contenido para: ${titulo}...`);
      
      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Eres un experto periodista deportivo. Escribe una previa SEO breve y emocionante de 150 palabras para el partido ${titulo}. Indica que la transmisión oficial en alta definición se puede seguir a través de nuestra agenda deportiva de SportLive. No uses links externos.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        postsNuevos.push({
          id: game.id,
          slug: titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-'),
          title: titulo,
          content: aiRes.data.choices[0].message.content,
          date: new Date().toISOString()
        });
      } catch (aiError) {
        console.error(`Error de IA para el partido ${titulo}:`, aiError.message);
      }

      // Límite de 5 para no agotar la cuota de la IA rápidamente
      if (postsNuevos.length >= 5) break;
    }

    if (postsNuevos.length > 0) {
      // Nos aseguramos de que la carpeta data exista
      if (!fs.existsSync('./data')) { fs.mkdirSync('./data'); }
      
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
      console.log("¡Archivo eventos-auto.json generado con éxito!");
    } else {
      console.log("No se generaron posts nuevos.");
    }

  } catch (error) {
    console.error("Error crítico en el proceso:", error.message);
  }
}

generarPost();