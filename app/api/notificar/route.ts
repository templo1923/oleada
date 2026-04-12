        vNativo.addEventListener('playing', () => { loading.style.display = 'none'; clearTimeout(stallTimeout); });
        
        // --- SOLUCIÓN PARA QUE LA PUBLICIDAD NO DAÑE LA SEÑAL ---
        vNativo.addEventListener('adskipped', () => { if (hlsInstancia) hlsInstancia.startLoad(); vNativo.play(); });
        vNativo.addEventListener('adfinished', () => { if (hlsInstancia) hlsInstancia.recoverMediaError(); vNativo.play(); });

        // ==========================================
        // LÓGICA PRINCIPAL DE MONETIZACIÓN NIVELES
        // ==========================================
        (function() {
            const dominiosVIP = ["vip-total.com"]; 
            const dominiosSemiVIP = ["oleadatvpremium.com", "catalogosco.top"]; 
            
            let clicsRequeridos = 3; 
            let verVideoVast = true; 
            
            const params = new URLSearchParams(window.location.search);
            
            if (window.top !== window.self) {
                try {
                    let dominioPadre = params.get("padre");
                    if (!dominioPadre && document.referrer && document.referrer !== "") {
                        dominioPadre = new URL(document.referrer).hostname;
                    }
                    if (dominioPadre) {
                        params.set("padre", dominioPadre);
                        const hostname = dominioPadre.replace('www.', '').toLowerCase();
                        
                        if (dominiosVIP.some(d => hostname.includes(d))) {
                            clicsRequeridos = 0;  verVideoVast = false; 
                        } else if (dominiosSemiVIP.some(d => hostname.includes(d))) {
                            clicsRequeridos = 1;  verVideoVast = true; 
                        }
                    }
                } catch (e) {}
            }

if (clicsRequeridos > 0) {
                const capaPublicidad = document.getElementById('capa-publicidad');
                capaPublicidad.style.display = 'block'; 
                let contadorClics = 0;
                
                capaPublicidad.addEventListener('click', function(e) {
                    // 1. Abrimos el pop-up (la publicidad)
                    contadorClics++;
                    window.open("https://catalogosco.top/", '_blank'); 

                    // 2. 🔥 MAGIA "CLICK-THROUGH": Pasamos el clic al reproductor 🔥
                    capaPublicidad.style.display = 'none'; // Quitamos el muro un milisegundo
                    
                    // Detectamos qué botón o parte del video estaba justo debajo del dedo/mouse
                    let elementoDebajo = document.elementFromPoint(e.clientX, e.clientY);
                    
                    // Si encontramos algo (ej. "Activar Sonido", "Saltar Anuncio" o "Play"), lo presionamos automáticamente
                    if (elementoDebajo) {
                        elementoDebajo.click();
                    }

                    // 3. Revisamos si ya cumplió los clics requeridos
                    if (contadorClics >= clicsRequeridos) {
                        contadorClics = 0; 
                        setTimeout(() => { capaPublicidad.style.display = 'block'; }, 60000); // Vuelve en 1 minuto
                    } else {
                        // Si le faltan clics, volvemos a poner la trampa inmediatamente para el siguiente toque
                        capaPublicidad.style.display = 'block';
                    }
                });
            }
            
            const r = params.get("r");
            let vFrame = document.getElementById("vFrame");
            const vipContainer = document.getElementById("vip-container");

            if (r) {
                try {
                    let urlDecodificada = atob(r);
                    
                    // INTERCEPTOR PARA EL PROXY JSON (M3U8)
                    if (urlDecodificada.includes('proxy_livetv.php') && !urlDecodificada.includes('.m3u8')) {

                        fetch(urlDecodificada)
                            .then(res => res.json())
                            .then(data => {
                                if (data.stream) {
                                    
                                    let metaReferrer = document.createElement('meta'); 
                                    metaReferrer.name = "referrer"; metaReferrer.content = "no-referrer";
                                    document.head.appendChild(metaReferrer);

                                    params.set('r', btoa(data.stream));
                                    window.location.replace(window.location.pathname + "?" + params.toString());
                                } else {
                                    document.querySelector('.texto-espera').innerHTML = data.error ? data.error : "Señal no disponible en este momento";
                                }
                            })
                            .catch(e => {
                                console.error(e);
                                document.querySelector('.texto-espera').innerHTML = "Error conectando...";
                            });
                        return; 
                    }
                    
                    if (urlDecodificada.includes('tdtcloud.xyz')) vFrame.removeAttribute('referrerpolicy');
                    if (urlDecodificada.startsWith('onlive|')) {
                        urlDecodificada = urlDecodificada.split('|')[1]; 
                        let meta = document.createElement('meta'); meta.name = "referrer"; meta.content = "no-referrer";
                        document.head.appendChild(meta);
                    }
                    
                    // ==========================================================
                    // 🔥 LA FUNCIÓN MAESTRA (AQUÍ ESTÁ TU LÓGICA INTACTA) 🔥
                    // ==========================================================
                    const arrancarSenalReal = () => {
                        if (urlDecodificada.includes('.m3u8') || urlDecodificada.includes('.ts') || urlDecodificada.includes('.mp4') || urlDecodificada.includes('telelatinomax.shop/play')) {
                            
                            // 🔥 VOLVEMOS A ENCENDER TU "CARGANDO" ORIGINAL AL ARRANCAR NATIVO 🔥
                            loading.style.display = 'block';
                            
                            vFrame.style.display = 'none';
                            vipContainer.style.display = 'block';
                            
                            window.parent.postMessage({ accion: "mostrarProyectar", urlVideo: urlDecodificada }, "*");

                            const esPeliculaVOD = urlDecodificada.includes('/vod/proxy');

                            if (esPeliculaVOD) {
                                pantallaTactil.style.display = 'none';
                                document.body.classList.remove('modo-envivo');
                            } else {
                                pantallaTactil.style.display = 'block';
                                document.body.classList.add('modo-envivo');
                            }

                            // En nativo solo dejamos midRolls para peliculas
                            let opcionesVastNativo = {};
                            if (verVideoVast) {
                                opcionesVastNativo = {
                                    allowVPAID: true,
                                    adList: [
                                        { roll: 'midRoll', timer: 60, vastTag: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' },
                                        { roll: 'midRoll', timer: 900, vastTag: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' },
                                        { roll: 'midRoll', timer: 1800, vastTag: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' },
                                        { roll: 'midRoll', timer: 2700, vastTag: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' }
                                    ]
                                };
                            }

                            reproductorFluid = fluidPlayer('video-nativo', {
                                layoutControls: {
                                    primaryColor: "#60a5fa",
                                    fillToContainer: true,
                                    autoPlay: true, mute: true,
                                    waitWithAd: true,
                                    adMethod: 'clickthrough
                                    
                                    playButtonShowing: esPeliculaVOD,
                                    playPauseAnimation: esPeliculaVOD, 
                                    doubleclickFullscreen: esPeliculaVOD
                                },
                                vastOptions: opcionesVastNativo
                            });

                            if (Hls.isSupported()) {
                                hlsInstancia = new Hls({
                                    debug: false, 
                                    enableWorker: true, 
                                    lowLatencyMode: true, 
                                    liveSyncDurationCount: 3, 
                                    liveMaxLatencyDurationCount: 10,
                                    maxBufferLength: 30, 
                                    maxMaxBufferLength: 60, 
                                    stretchShortVideoTrack: true, 
                                    maxAudioFramesDrift: 1, 
                                    liveDurationInfinity: true 
                                });
                                
                                let urlFinalParaHls = urlDecodificada;
                                
                                if (urlDecodificada.includes('fubohd.com') || urlDecodificada.includes('pltvhd.com')) {
                                    urlFinalParaHls = "https://api.telelatinomax.shop/api/proxy_pltv.php?v=" + btoa(urlDecodificada);
                                }

                                hlsInstancia.loadSource(urlFinalParaHls); 
                                hlsInstancia.attachMedia(vNativo);
                                hlsInstancia.on(Hls.Events.MANIFEST_PARSED, function() {
                                    loading.style.display = 'none';
                                    vNativo.play().catch(e => console.log("Play bloqueado"));
                                });
                                
                                hlsInstancia.on(Hls.Events.ERROR, function (event, data) {
                                    if (data.fatal) {
                                        switch (data.type) {
                                            case Hls.ErrorTypes.NETWORK_ERROR: hlsInstancia.startLoad(); break;
                                            case Hls.ErrorTypes.MEDIA_ERROR: hlsInstancia.recoverMediaError(); break;
                                            default: hlsInstancia.destroy(); break;
                                        }
                                    }
                                });
                            } 
                            else if (vNativo.canPlayType('application/vnd.apple.mpegurl')) {
                                let urlFinalSafari = urlDecodificada;
                                if (urlDecodificada.includes('fubohd.com') || urlDecodificada.includes('pltvhd.com')) {
                                    urlFinalSafari = "https://api.telelatinomax.shop/api/proxy_pltv.php?v=" + btoa(urlDecodificada);
                                }
                                vNativo.src = urlFinalSafari;
                                vNativo.addEventListener('loadedmetadata', function() {
                                    loading.style.display = 'none'; vNativo.play().catch(e => console.log("Play bloqueado"));
                                });
                            }
                            
                        } else {
                            // --- RUTA EMBED (IFRAMES) ---
                            vipContainer.style.display = 'none'; 
                            window.parent.postMessage({ accion: "deshabilitarProyectar" }, "*");
                            
                            const parent = vFrame.parentNode;
                            const nuevoIframe = document.createElement('iframe');
                            nuevoIframe.id = "vFrame";
                            nuevoIframe.setAttribute("allowfullscreen", "true");
                            nuevoIframe.setAttribute("allow", "autoplay; encrypted-media; fullscreen"); 
                            
                            const servidoresPelis = ['streamwish', 'vidhide', 'do7go', 'bysejikuar', 'josephseveralconcern', 'vimeos', 'vimeus', 'goodstream', 'hlswish', 'voe', 'do7ho', 'niramirus', 'embedwish', 'filemoon', 'mixdrop', 'doods', 'upstream', 'uqload', 'streamtape'];
                            const esPelicula = servidoresPelis.some(servidor => urlDecodificada.toLowerCase().includes(servidor)) || urlDecodificada.includes('/e/') || urlDecodificada.includes('/v/') || urlDecodificada.includes('embed-');

                            if (!esPelicula) {
                                if (urlDecodificada.includes('tvtvhd.com') || urlDecodificada.includes('pltvhd.com')) {
                                    nuevoIframe.src = "https://api.telelatinomax.shop/api/proxy.php?url=" + btoa(urlDecodificada);
                                } else if (urlDecodificada.includes('vuen.link') || urlDecodificada.includes('onlive') || urlDecodificada.includes('ch?id=')) {
                                    nuevoIframe.src = urlDecodificada; // Sin Sandbox para los búlgaros
                                } else {
                                    nuevoIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-presentation');
                                    nuevoIframe.src = urlDecodificada;
                                }
                            } else {
                                nuevoIframe.src = urlDecodificada; 
                            }
                            
                            nuevoIframe.style.display = 'block';
                            parent.replaceChild(nuevoIframe, vFrame);
                            vFrame = nuevoIframe;
                            vFrame.onload = function() { loading.style.display = 'none'; };
                        }
                    };


                        arrancarSenalReal();
                

                } catch (e) {
                    console.error("Error general decodificando señal:", e);
                    loading.innerText = "Error cargando señal de video";
                }
            }
        })();
    </script>
</body>
</html>