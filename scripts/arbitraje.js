const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function generarNoticiasPro() {
  try {
    console.log("🔥 Buscando partidos CLASE A...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    
    let noticiasGeneradas = [];

    for (const juego of juegos) {
      const local = juego.homeCompetitor?.name;
      const visitante = juego.awayCompetitor?.name;
      const liga = juego.competitionDisplayName || "";

      // FILTRO INTELIGENTE: Solo ligas que traen tráfico real
      const ligasTop = ["Premier League", "LaLiga", "Serie A", "Bundesliga", "Ligue 1", "Liga BetPlay", "Copa Libertadores", "Champions League", "Liga MX", "Liga Profesional Argentina"];
      
      const esTop = ligasTop.some(t => liga.includes(t));
      
      if (!esTop) continue; // Si es una liga desconocida, la ignoramos

      console.log(`💎 PARTIDO TOP DETECTADO: ${local} vs ${visitante} (${liga})`);

      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Actúa como un analista deportivo de ESPN. Escribe una previa explosiva de 160 palabras para el partido ${local} vs ${visitante} de la ${liga}. 
            - Usa un tono de urgencia y emoción.
            - Habla de las estrellas del partido.
            - DI ESTO LITERALMENTE: 'La señal en vivo con la mejor calidad HD y sin anuncios molestos la encuentras en nuestra Agenda de SportLive. ¡Haz clic para no perdértelo!'.`
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
          title: `🔥 EN VIVO: ${local} vs ${visitante} - Pronóstico y Dónde Ver`,
          content: aiRes.data.choices[0].message.content,
          liga: liga,
          date: new Date().toISOString()
        });
        
        console.log(`✅ Noticia creada para ${local}`);
      } catch (e) {
        console.log(`❌ Error con Groq en este partido: ${e.response?.data?.error?.message || e.message}`);
      }

      if (noticiasGeneradas.length >= 6) break;
    }

    if (noticiasGeneradas.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticiasGeneradas, null, 2));
      console.log(`🚀 MISIÓN CUMPLIDA: ${noticiasGeneradas.length} noticias premium listas.`);
    } else {
      console.log("ℹ️ Hoy no hay partidos de ligas TOP en esta API.");
    }

  } catch (error) {
    console.log("Error crítico de conexión.");
  }
}

generarNoticiasPro();