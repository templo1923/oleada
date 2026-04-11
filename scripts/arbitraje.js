const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const url = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true`;

async function generar() {
  try {
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    if (juegos.length === 0) return console.log("No hay juegos");

    let resultados = [];
    // Solo procesamos los 3 primeros para asegurar que funcione rápido
    for (let i = 0; i < Math.min(juegos.length, 3); i++) {
      const bloqueDatos = JSON.stringify(juegos[i]);
      
      try {
        const ai = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-8b-8192",
          messages: [{
            role: "user",
            content: "Basado en este texto, dime qué equipos juegan y escribe una breve noticia de 100 palabras para SportLive: " + bloqueDatos
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        resultados.push({
          id: juegos[i].id || Date.now() + i,
          slug: "evento-deportivo-" + (juegos[i].id || i),
          title: "Partido en Vivo HD",
          content: ai.data.choices[0].message.content,
          date: new Date().toISOString()
        });
        console.log("IA generó noticia para juego " + i);
      } catch (e) { console.log("Fallo en IA"); }
    }

    if (!fs.existsSync('./data')) fs.mkdirSync('./data');
    fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(resultados, null, 2));
    console.log("PROCESO FINALIZADO EXITOSAMENTE");
  } catch (err) {
    console.log("Error de conexión");
  }
}
generar();