const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function iniciarRobot() {
  try {
    if (!GROQ_API_KEY) {
      console.log("❌ ERROR: No configuraste la clave GROQ_API_KEY en GitHub Secrets.");
      return;
    }

    console.log("📡 Conectando con 365Scores...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    let noticiasGeneradas = [];

    for (const juego of juegos.slice(0, 3)) {
      const local = juego.homeCompetitor?.name || "Local";
      const visitante = juego.awayCompetitor?.name || "Visitante";

      console.log(`✍️ Intentando redactar: ${local} vs ${visitante}`);

      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-8b-8192",
          messages: [{
            role: "user",
            content: `Escribe una noticia de 100 palabras para SportLive sobre el partido ${local} vs ${visitante}.`
          }]
        }, {
          headers: { 
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        noticiasGeneradas.push({
          id: juego.id,
          slug: `${local}-${visitante}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${local} vs ${visitante}`,
          content: aiRes.data.choices[0].message.content
        });
        console.log(`✅ Éxito con ${local}`);

      } catch (e) {
        // AQUÍ ESTÁ EL CHISMOSO: Imprimirá el error exacto de Groq
        const errorMsg = e.response?.data?.error?.message || e.message;
        console.log(`❌ ERROR DE GROQ EN ${local}: ${errorMsg}`);
      }
    }

    if (noticiasGeneradas.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticiasGeneradas, null, 2));
      console.log("🚀 Archivo guardado.");
    }

  } catch (error) {
    console.log("Error de conexión API: " + error.message);
  }
}

iniciarRobot();