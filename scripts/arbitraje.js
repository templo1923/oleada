const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL fija para hoy 10 de abril
const SCORES_API = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true`;

async function generarPost() {
  try {
    const response = await axios.get(SCORES_API);
    const games = response.data?.games || [];
    
    let postsNuevos = [];

    // Tomamos los primeros 5 partidos
    for (const game of games.slice(0, 5)) {
      try {
        // Le enviamos el bloque entero a la IA para que ella no se equivoque
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-8b-8192",
          messages: [{
            role: "user",
            content: `Extrae los equipos de este JSON y escribe una previa de 100 palabras para SportLive indicando que la señal HD está en nuestra agenda: ${JSON.stringify(game)}`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        const textoIA = aiRes.data.choices[0].message.content;
        
        postsNuevos.push({
          id: game.id || Math.random(),
          slug: `partido-${game.id || Date.now()}`,
          title: "Transmisión en Vivo HD",
          content: textoIA,
          date: new Date().toISOString()
        });
      } catch (e) { console.log("Error en un partido, saltando..."); }
    }

    if (!fs.existsSync('./data')) fs.mkdirSync('./data');
    fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(postsNuevos, null, 2));
    console.log("✅ PROCESO COMPLETADO CON ÉXITO");

  } catch (error) {
    console.log("Error de conexión");
  }
}
generarPost();