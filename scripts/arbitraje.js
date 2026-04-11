const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL que confirmamos con tu PHP
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function iniciarRobot() {
  try {
    if (!GROQ_API_KEY) {
      console.log("❌ ERROR: No se encontró la variable GROQ_API_KEY en GitHub Secrets.");
      return;
    }

    console.log("📡 Conectando con 365Scores...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    let noticiasGeneradas = [];

    // Filtro para evitar ligas desconocidas y solo ir por lo que da dinero
    const ligasTop = ["LaLiga", "Premier", "Serie A", "Bundesliga", "Ligue 1", "BetPlay", "Libertadores", "Champions", "Argentina", "MX"];

    for (const juego of juegos) {
      const local = juego.homeCompetitor?.name;
      const visitante = juego.awayCompetitor?.name;
      const liga = juego.competitionDisplayName || "";

      // Si no es liga TOP, saltamos para no gastar IA
      const esInteresante = ligasTop.some(t => liga.includes(t));
      if (!esInteresante) continue;

      console.log(`✍️ Intentando redactar: ${local} vs ${visitante}...`);

      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192", 
          messages: [{
            role: "user",
            content: `Eres analista de SportLive. Escribe una previa de 120 palabras para ${local} vs ${visitante} de la ${liga}. Tono emocionante. Menciona señal HD en nuestra agenda.`
          }]
        }, {
          headers: { 
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json' 
          }
        });

        noticiasGeneradas.push({
          id: juego.id,
          slug: `${local}-vs-${visitante}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `🔥 EN VIVO: ${local} vs ${visitante}`,
          content: aiRes.data.choices[0].message.content,
          date: new Date().toISOString()
        });
        console.log(`✅ Éxito con ${local}`);

      } catch (eIA) {
        // ESTO ES LO QUE NECESITAMOS LEER EN EL LOG
        const errorIA = eIA.response?.data?.error?.message || eIA.message;
        console.log(`❌ ERROR DE GROQ EN ${local}: ${errorIA}`);
      }

      if (noticiasGeneradas.length >= 5) break;
    }

    if (noticiasGeneradas.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticiasGeneradas, null, 2));
      console.log("🚀 ARCHIVO data/eventos-auto.json GUARDADO.");
    } else {
      console.log("ℹ️ No se encontraron partidos de ligas TOP en este momento.");
    }

  } catch (error) {
    console.log("🚫 Error crítico: " + error.message);
  }
}

iniciarRobot();