const axios = require('axios');
const fs = require('fs');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// URL Dinámica para que mañana sábado funcione solo
const d = new Date();
const hoy = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
const url = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=${hoy}&endDate=${hoy}&showOdds=true&onlyMajorGames=true&withTop=true`;

async function robotSportLive() {
  try {
    console.log(`🚀 Iniciando escaneo para el ${hoy}...`);
    const res = await axios.get(url);
    const juegos = res.data?.games || [];
    
    if (juegos.length === 0) {
        console.log("No hay eventos en la API.");
        return;
    }

    let noticiasFinales = [];

    // Agarramos los 10 primeros eventos (donde está la acción)
    for (const j of juegos.slice(0, 10)) {
      const local = j.homeCompetitor?.name || "Equipo Local";
      const visita = j.awayCompetitor?.name || "Equipo Visitante";
      
      console.log(`✍️ Procesando contenido VIP para: ${local} vs ${visita}`);

      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: `Actúa como un analista premium de SportLive. Analiza este JSON de un partido y escribe una NOTICIA COMPLETA (200 palabras):
            1. Habla de la importancia del partido.
            2. Extrae alineaciones o bajas si aparecen en los datos.
            3. Menciona cuotas de apuestas si el JSON las tiene.
            4. TITULAR EXPLOSIVO con emojis.
            5. DI: 'La señal HD sin cortes y el minuto a minuto real están en nuestra Agenda SportLive. ¡Entra ya!'.
            
            DATOS DEL PARTIDO: ${JSON.stringify(j)}`
          }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
        });

        noticiasFinales.push({
          id: j.id,
          slug: `${local}-vs-${visita}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `🔥 COBERTURA TOTAL: ${local} vs ${visita}`,
          content: aiRes.data.choices[0].message.content,
          date: new Date().toISOString()
        });
        console.log(`✅ Noticia Pro generada para ${local}`);

      } catch (e) {
        console.log(`Fallo en IA: ${e.message}`);
      }
    }

    if (noticiasFinales.length > 0) {
      if (!fs.existsSync('./data')) fs.mkdirSync('./data');
      fs.writeFileSync('./data/eventos-auto.json', JSON.stringify(noticiasFinales, null, 2));
      console.log("🔥 SISTEMA ALIMENTADO EXITOSAMENTE.");
    }

  } catch (error) {
    console.log("Error de conexión: " + error.message);
  }
}

robotSportLive();