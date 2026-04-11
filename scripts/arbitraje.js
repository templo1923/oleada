const axios = require('axios');
const fs = require('fs');
const key = process.env.GROQ_API_KEY;
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function iniciar() {
  try {
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    let noticias = [];

    for (let i = 0; i < Math.min(juegos.length, 2); i++) {
      const datosRaw = JSON.stringify(juegos[i]);
      const ai = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama3-8b-8192",
        messages: [{role: "user", content: "Escribe una noticia corta de este partido: " + datosRaw}]
      }, { headers: { 'Authorization': `Bearer ${key}` } });

      noticias.push({
        id: juegos[i].id || i,
        slug: "evento-" + i,
        title: "Partido en Vivo",
        content: ai.data.choices[0].message.content
      });
    }
    if (!fs.existsSync('./data')) fs.mkdirSync('./data');
    fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticias, null, 2));
    console.log("TODO_LISTO_SIN_ERRORES");
  } catch (e) { console.log("Error controlado"); }
}
iniciar();