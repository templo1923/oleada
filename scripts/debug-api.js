const axios = require('axios');
const fs = require('fs');

const hoy = new Date().toISOString().split('T')[0].split('-').reverse().join('/'); 
const url = `https://webws.365scores.com/web/games/allscores/?appTypeId=5&langId=14&timezoneName=America/Bogota&userCountryId=18&sports=1&startDate=${hoy}&endDate=${hoy}&showOdds=true&onlyMajorGames=true&withTop=true`;

async function capturarDatos() {
  try {
    console.log("Conectando con 365Scores para descargar el JSON real...");
    const response = await axios.get(url);
    
    // Guardamos TODO lo que responde la API en un archivo de texto
    fs.writeFileSync('./data/debug-api-raw.json', JSON.stringify(response.data, null, 2));
    
    console.log("✅ ¡DATOS CAPTURADOS!");
    console.log("Revisa ahora el archivo: data/debug-api-raw.json");
    
    // Mostramos en consola las llaves principales que encontró
    console.log("Llaves encontradas en el JSON:", Object.keys(response.data));
    
    if (response.data.games) {
        console.log("Primer juego encontrado (Estructura bruta):", JSON.stringify(response.data.games[0], null, 2));
    }

  } catch (error) {
    console.error("Error al capturar datos:", error.message);
  }
}

capturarDatos();