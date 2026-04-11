const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Fecha fija para asegurar datos (puedes volver a poner la dinámica después)
const url = "https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=10/04/2026&endDate=10/04/2026&showOdds=true&onlyMajorGames=true&withTop=true";

async function iniciarRobot() {
  try {
    console.log("Conectando con la central de datos...");
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    
    let noticiasGeneradas = [];

    // Procesamos los 6 partidos más importantes
    for (const juego of juegos.slice(0, 6)) {
      
      // Extracción segura basada en tu PHP exitoso
      const local = juego.homeCompetitor?.name || "Equipo Local";
      const visitante = juego.awayCompetitor?.name || "Equipo Visitante";
      const liga = juego.competitionDisplayName || "Fútbol Internacional";

      if (local === "Equipo Local") continue; // Saltamos datos basura

      console.log(`Redactando noticia premium para: ${local} vs ${visitante}`);

      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192", // Usamos el modelo potente para mejor redacción
          messages: [{
            role: "user",
            content: `Eres un periodista deportivo de élite. Escribe una noticia de 150 palabras sobre el partido ${local} vs ${visitante} de la liga ${liga}. 
            REGLAS:
            1. Usa un titular explosivo con emojis.
            2. Analiza el choque (puntos, rivalidad o importancia).
            3. DI CLARAMENTE: 'La transmisión oficial sin cortes y en calidad 4K está disponible en nuestra exclusiva Agenda SportLive. No te pierdas ni un segundo del juego aquí'.
            4. Tono de urgencia máxima.`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });

        noticiasGeneradas.push({
          id: juego.id,
          slug: `${local}-vs-${visitante}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `Ocasión de Oro: ${local} vs ${visitante} en VIVO`,
          content: aiRes.data.choices[0].message.content,
          date: new Date().toISOString()
        });
      } catch (e) {
        console.log("Fallo en redacción de un partido.");
      }
    }

    if (noticiasGeneradas.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticiasGeneradas, null, 2));
      console.log(`🚀 ÉXITO: Se han publicado ${noticiasGeneradas.length} noticias de alta calidad.`);
    }

  } catch (error) {
    console.log("Error de conexión con la API.");
  }
}

iniciarRobot();