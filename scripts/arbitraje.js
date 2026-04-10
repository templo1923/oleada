const axios = require('axios');
const fs = require('fs');

// Configuración de APIs
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SCORES_API = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&showOdds=true&onlyMajorGames=true&withTop=true";

async function generarPost() {
  try {
    // 1. Obtener partidos de hoy
    const response = await axios.get(SCORES_API);
    const games = response.data.games || [];
    const topGames = games.slice(0, 5); // Tomamos los 5 mejores

    let postsNuevos = [];

    for (const game of topGames) {
      const titulo = `${game.homeTeam.name} vs ${game.awayTeam.name}`;
      
      // 2. Pedir a la IA de Groq que redacte
      const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama3-70b-8192",
        messages: [{
          role: "user",
          content: `Eres un periodista deportivo. Escribe una previa SEO de 200 palabras para el partido ${titulo}. No pongas enlaces, solo di que pueden verlo en nuestra agenda HD.`
        }]
      }, {
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
      });

      postsNuevos.push({
        id: game.id,
        slug: titulo.toLowerCase().replace(/ /g, '-'),
        title: titulo,
        content: aiRes.data.choices[0].message.content,
        date: new Date().toISOString()
      });
    }

    // 3. Guardar en tu archivo de datos (o podrías enviarlo a tu MySQL)
    fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
    console.log("Posts generados con éxito");

  } catch (error) {
    console.error("Error en el proceso:", error);
  }
}

generarPost();