const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Usamos la misma URL que te funcionó en el PHP
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function generar() {
  try {
    console.log("Conectando con la API...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    
    let resultados = [];

    // Procesamos los primeros 10 partidos que salieron en tu tabla
    for (const juego of juegos.slice(0, 10)) {
      
      // Sacamos los nombres tal cual salieron en tu PHP
      const local = juego.homeCompetitor?.name;
      const visitante = juego.awayCompetitor?.name;
      const liga = juego.competitionDisplayName || "Fútbol Internacional";

      if (!local || !visitante) continue;

      const titulo = `${local} vs ${visitante}`;
      console.log(`Escribiendo noticia para: ${titulo}`);

      try {
        const ai = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-8b-8192",
          messages: [{
            role: "user",
            content: `Eres un periodista deportivo. Escribe una previa SEO de 120 palabras para el partido ${titulo} de la ${liga}. Menciona que pueden verlo en HD en nuestra agenda de SportLive. Tono emocionante.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        resultados.push({
          id: juego.id,
          slug: titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: titulo,
          content: ai.data.choices[0].message.content,
          date: new Date().toISOString()
        });
      } catch (e) {
        console.log("Fallo Groq en este partido");
      }
    }

    if (resultados.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(resultados, null, 2));
      console.log("✅ TODO LISTO: Archivo generado con " + resultados.length + " noticias.");
    }
  } catch (err) {
    console.log("Error de conexión");
  }
}
generar();