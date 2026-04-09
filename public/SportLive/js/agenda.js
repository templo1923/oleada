/* global luxon, jQuery */
const $ = jQuery;
const AGENDA_URL = "api/proxy.php"; 
const IMG_BASE = "https://cdn.pltvhd.com";

$(document).ready(function () {
    obtenerAgenda();
    
    // Manejo de clics para abrir canales
    $(document).on("click", ".match-info", function() {
        const $channels = $(this).next(".match-channels");
        $(".match-channels").not($channels).slideUp(200);
        $(".toggle-icon").not($(this).find(".toggle-icon")).removeClass("rotate");
        $channels.slideToggle(200);
        $(this).find(".toggle-icon").toggleClass("rotate");
    });

    setInterval(obtenerAgenda, 120000);
});

async function obtenerAgenda() {
    const menuElement = document.getElementById("menu");
    const titleElement = document.getElementById("title-agenda");

    if (!menuElement) return;

    try {
        const response = await fetch(AGENDA_URL); 
        const result = await response.json();
        
        if (!result || !result.data || result.data.length === 0) {
            menuElement.innerHTML = "<p style='text-align:center; color:#94a3b8; padding:20px; font-size:12px;'>No hay eventos disponibles hoy.</p>";
            if (titleElement) titleElement.innerHTML = "AGENDA - SIN EVENTOS";
            return;
        }

        const partidosOrdenados = result.data.sort((a, b) => {
            const horaA = a.attributes.diary_hour;
            const horaB = b.attributes.diary_hour;
            return horaA.localeCompare(horaB);
        });

        // ✅ LOGICA DE FECHA DINÁMICA PRO (Mantenida)
        if (titleElement && partidosOrdenados[0]) {
            const rawDate = partidosOrdenados[0].attributes.date_diary;
            const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
            const fechaFormateada = new Date(rawDate + "T00:00:00").toLocaleDateString('es-ES', opciones);
            const totalPartidos = partidosOrdenados.length;

            titleElement.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:6px; padding: 10px 0;">
                    <span style="color:#ffffff; font-size:16px; font-weight:800; letter-spacing:0.5px;">Agenda - ${fechaFormateada}</span>
                    <div style="display:flex; align-items:center; justify-content:center; gap:8px; color:#60a5fa; font-size:11px; font-weight:600; text-transform:uppercase;">
                        <i class="fas fa-clock"></i> Horarios locales 
                        <span style="color:#334155;">•</span>
                        <i class="fas fa-satellite-dish"></i> ${totalPartidos} Transmisiones
                    </div>
                </div>`;
        }

        let html = "";
        partidosOrdenados.forEach((evento) => {
            const attr = evento.attributes;
            const embeds = attr.embeds?.data || [];
            
            let imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
            const flagPath = attr.country?.data?.attributes?.image?.data?.attributes?.url;
            if (flagPath) imageUrl = flagPath.startsWith('http') ? flagPath : `${IMG_BASE}${flagPath}`;

            // Puntito de En Vivo (Mantenido)
            const ahora = new Date();
            const horaActual = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');
            const esAhora = attr.diary_hour <= horaActual ? '<span class="live-dot-mini"></span>' : '';

            html += `
                <div class="match-card">
                    <div class="match-info">
                        <div class="match-time">${esAhora}${attr.diary_hour.substring(0,5)}</div>
                        <img src="${imageUrl}" class="match-flag">
                        <div class="match-name">${attr.diary_description}</div>
                        <i class="fas fa-chevron-down toggle-icon"></i>
                    </div>
                    <div class="match-channels">
                        ${embeds.map(emb => {
                            let linkLimpio = emb.attributes.embed_iframe;
                            
                            if (linkLimpio.includes('eventos.html?r=')) {
                                linkLimpio = linkLimpio.split('eventos.html?r=')[1];
                            }
                            
                            // 🔥 LIMPIEZA CRÍTICA: Quitamos saltos de línea y normalizamos espacios
                            const nombreEvento = attr.diary_description.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim(); 
                            
                            const rBase64 = linkLimpio.startsWith('http') ? btoa(linkLimpio) : linkLimpio;

                            return `
                                <a href="ver.html?r=${rBase64}&n=${encodeURIComponent(nombreEvento)}" class="channel-link">
                                    <i class="fas fa-play-circle"></i> ${emb.attributes.embed_name}
                                </a>`;
                        }).join('')}
                    </div>
                </div>`;
        });

        menuElement.innerHTML = html;

    } catch (error) {
        console.error("Error cargando agenda:", error);
        menuElement.innerHTML = "<p style='text-align:center; color:#ef4444; padding:20px; font-size:12px;'>Error de conexión.</p>";
    }
}