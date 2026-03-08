import { useState, useEffect, useRef } from "react";

const WEATHER_KEY = "b48c62f42a1fc6a8122b0b5d54ad24a2";

const CSS = `
@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

.mw-wrap *{box-sizing:border-box;margin:0;padding:0}
.mw-wrap{font-family:'Instrument Sans',sans-serif;color:#F5EFE6;line-height:1.5}

@keyframes mw-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes mw-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes mw-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.mw-fu{animation:mw-fadeUp .4s cubic-bezier(.23,1,.32,1) both}

/* COLLAPSED BAR */
.mw-bar{
  padding:12px 18px;cursor:pointer;
  display:flex;align-items:center;justify-content:space-between;
  transition:background .2s;border-radius:0;
}
.mw-bar:hover{background:rgba(255,255,255,.02)}
.mw-bar-left{display:flex;align-items:center;gap:10px}
.mw-bar-title{font-size:12px;font-weight:700;color:#E8432D;text-transform:uppercase;letter-spacing:2px}
.mw-bar-sub{font-size:11px;color:rgba(245,239,230,.4)}
.mw-bar-right{display:flex;align-items:center;gap:10px}
.mw-live{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(245,239,230,.5)}
.mw-live-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80;animation:mw-pulse 2s infinite}
.mw-chevron{color:rgba(245,239,230,.4);font-size:13px;transition:transform .25s}
.mw-chevron.open{transform:rotate(180deg)}

/* CARD */
.mw-card{
  background:linear-gradient(145deg,#1c1610,#141009);
  border:1px solid rgba(255,255,255,.07);
  border-radius:24px;overflow:hidden;
  box-shadow:0 24px 60px rgba(0,0,0,.45);
}

/* WEATHER STRIP */
.mw-weather{
  padding:16px 20px;
  background:linear-gradient(135deg,rgba(232,67,45,.08),rgba(212,169,106,.05));
  border-bottom:1px solid rgba(255,255,255,.05);
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;
}
.mw-weather-main{display:flex;align-items:center;gap:12px;flex:1;min-width:200px}
.mw-weather-icon{font-size:42px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))}
.mw-weather-temp{font-family:'Fraunces',serif;font-size:36px;font-weight:900;letter-spacing:-2px;background:linear-gradient(135deg,#E8432D,#FF8C6E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mw-weather-info{flex:1}
.mw-weather-desc{font-size:14px;font-weight:600;color:#F5EFE6;text-transform:capitalize;margin-bottom:2px}
.mw-weather-loc{font-size:11px;color:rgba(245,239,230,.45)}
.mw-weather-stats{display:flex;gap:14px;flex-wrap:wrap}
.mw-stat{display:flex;flex-direction:column;align-items:center;padding:8px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px}
.mw-stat-val{font-family:'Fraunces',serif;font-size:17px;font-weight:700;color:#F0C98A}
.mw-stat-lbl{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(245,239,230,.35);margin-top:1px}

/* FORECAST */
.mw-forecast{padding:12px 20px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;gap:8px;overflow-x:auto}
.mw-forecast::-webkit-scrollbar{height:3px}
.mw-forecast::-webkit-scrollbar-thumb{background:rgba(232,67,45,.3);border-radius:3px}
.mw-day{flex:1;min-width:60px;text-align:center;padding:10px 8px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);transition:all .2s;cursor:default}
.mw-day:hover{background:rgba(232,67,45,.06);border-color:rgba(232,67,45,.2)}
.mw-day-name{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(245,239,230,.4);margin-bottom:4px}
.mw-day-icon{font-size:20px;margin:4px 0}
.mw-day-temp{font-size:13px;font-weight:700;color:#F5EFE6}
.mw-day-min{font-size:10px;color:rgba(245,239,230,.35)}

/* MAP */
.mw-map-wrap{position:relative;height:280px}
.mw-map{width:100%;height:100%}
.mw-map-overlay{
  position:absolute;bottom:14px;left:14px;
  background:rgba(12,8,6,.85);backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,.1);border-radius:14px;
  padding:10px 14px;z-index:1000;
  display:flex;align-items:center;gap:10px;
}
.mw-map-dest{font-family:'Fraunces',serif;font-size:15px;font-weight:700;letter-spacing:-.3px}
.mw-map-country{font-size:11px;color:rgba(245,239,230,.5)}
.mw-map-badge{padding:3px 9px;border-radius:100px;background:rgba(232,67,45,.12);border:1px solid rgba(232,67,45,.25);font-size:10px;font-weight:700;color:#E8432D}

/* TIPS */
.mw-tips{padding:14px 20px;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.05)}
.mw-tip{display:flex;align-items:center;gap:7px;padding:7px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);border-radius:10px;font-size:12px;color:rgba(245,239,230,.65)}

/* LOADING */
.mw-loading{padding:40px;text-align:center}
.mw-spinner{width:32px;height:32px;border:2.5px solid rgba(232,67,45,.15);border-top:2.5px solid #E8432D;border-radius:50%;animation:mw-spin 1s linear infinite;margin:0 auto 12px}

/* LEAFLET OVERRIDES */
.mw-wrap .leaflet-container{background:#141009!important}
.mw-wrap .leaflet-tile{filter:brightness(.85) saturate(.7) hue-rotate(10deg)!important}
.mw-wrap .leaflet-control-attribution{background:rgba(12,8,6,.7)!important;color:rgba(245,239,230,.3)!important;font-size:9px!important}
.mw-wrap .leaflet-control-zoom a{background:#1c1610!important;color:#F5EFE6!important;border-color:rgba(255,255,255,.1)!important}
.mw-wrap .leaflet-control-zoom a:hover{background:#E8432D!important}
`;

const WEATHER_ICONS = {
  "01d":"☀️","01n":"🌙","02d":"⛅","02n":"⛅",
  "03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️",
  "09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️",
  "11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️","50n":"🌫️"
};

const DAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const DESTINATION_COORDS = {
  CTG:{ lat:10.3910, lng:-75.4794, tips:["Lleva ropa ligera — humedad alta todo el año","Mejor para caminar de 6–10am antes del calor","Agua embotellada siempre"] },
  BOG:{ lat:4.7110, lng:-74.0721, tips:["Trae chamarra — noches frías a 2600m","Lluvia frecuente: paraguas esencial","Altitud: tómate el primer día con calma"] },
  MDE:{ lat:6.2442, lng:-75.5812, tips:["Primavera eterna — 22°C todo el año","Lluvia en mayo y octubre","Metro es la forma más segura de moverse"] },
  LIM:{ lat:-12.0464, lng:-77.0428, tips:["Garúa jun–nov: nublado pero no llueve","Miraflores y Barranco para pasear seguro","Temperatura sorprendentemente fresca"] },
  CUZ:{ lat:-13.5320, lng:-71.9675, tips:["Altitud 3400m: 2 días de aclimatación mínimo","Temporada seca: mayo–octubre","Noches muy frías — trae ropa de abrigo"] },
  EZE:{ lat:-34.6037, lng:-58.3816, tips:["Verano dic–feb, invierno jun–ago","Microclima variable: siempre trae capas","Recoleta y Palermo son seguros para turistas"] },
  MAD:{ lat:40.4168, lng:-3.7038, tips:["Verano muy caluroso: hidratación constante","Invierno suave pero con viento frío","La siesta es real: museos cierran 14–16h"] },
  LIS:{ lat:38.7223, lng:-9.1393, tips:["Mejor clima: marzo–junio y sept–oct","Viento atlántico: lleva chaqueta ligera","Buen paraguas para la lluvia invernal"] },
  NRT:{ lat:35.6762, lng:139.6503, tips:["Primavera (mar–may) y otoño (sept–nov): perfectos","Verano muy húmedo y caluroso","Tifones: sept puede traer lluvia intensa"] },
  OAX:{ lat:17.0732, lng:-96.7266, tips:["Clima templado todo el año: 22–26°C","Temporada de lluvias: junio–septiembre","Factor solar alto — protector SPF 50+"] },
  DPS:{ lat:-8.3405, lng:115.0920, tips:["Temporada seca: abril–octubre (ideal)","Lluvia nov–mar: torrencial pero corta","Humedad alta — ropa ligera y transpirable"] },
  CMN:{ lat:33.5731, lng:-7.5898, tips:["Inviernos suaves, veranos cálidos","Ramadán cambia horarios de todo","Medina: vestimenta respetuosa requerida"] },
};

function getWeatherTips(weather) {
  const temp = weather?.main?.temp;
  const desc = weather?.weather?.[0]?.main;
  const tips = [];
  if (temp > 30) tips.push({ icon:"🌡️", text:`Calor intenso ${Math.round(temp)}°C — hidratación constante` });
  else if (temp < 10) tips.push({ icon:"🧥", text:`Frío ${Math.round(temp)}°C — lleva abrigo` });
  else tips.push({ icon:"✅", text:`Temperatura agradable ${Math.round(temp)}°C para explorar` });
  if (desc === "Rain") tips.push({ icon:"☂️", text:"Lluvia hoy — lleva paraguas" });
  if (desc === "Clear") tips.push({ icon:"🕶️", text:"Sol despejado — protector solar" });
  if (desc === "Clouds") tips.push({ icon:"⛅", text:"Nublado — buen día para caminar" });
  return tips;
}

export default function MapWeather({ destination }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const destCode = destination?.code || "CTG";
  const coords = DESTINATION_COORDS[destCode] || { lat:10.39, lng:-75.47, tips:[] };
  const destName = destination?.name || "Cartagena";
  const destCountry = destination?.country || "";

  // Load Leaflet dynamically
  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Init map when open
  useEffect(() => {
    if (!open || !leafletLoaded || !mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    setTimeout(() => {
      if (!mapRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl:true, scrollWheelZoom:false, attributionControl:true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:'© CartoDB',maxZoom:18
      }).addTo(map);

      const icon = L.divIcon({
        html:`<div style="width:36px;height:36px;background:linear-gradient(135deg,#E8432D,#C73520);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(232,67,45,.5)"></div>`,
        iconSize:[36,36],iconAnchor:[18,36],className:""
      });

      const marker = L.marker([coords.lat, coords.lng], { icon }).addTo(map);
      marker.bindPopup(`<div style="font-family:'Instrument Sans',sans-serif;padding:4px;min-width:120px"><strong style="color:#E8432D;font-size:14px">${destName}</strong><br/><span style="color:#666;font-size:12px">${destCountry}</span></div>`);
      map.setView([coords.lat, coords.lng], 12);
      mapInstanceRef.current = map;
      markerRef.current = marker;
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [open, leafletLoaded, destCode]);

  // Fetch weather
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const fetchWeather = async () => {
      try {
        const [curRes, foreRes] = await Promise.all([
          fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${WEATHER_KEY}&units=metric&lang=es`),
          fetch(`/api/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${WEATHER_KEY}&units=metric&lang=es&cnt=40`)
        ]);
        const cur = await curRes.json();
        const fore = await foreRes.json();
        setWeather(cur);

        // Get one reading per day
        const days = {};
        fore.list?.forEach(item => {
          const d = item.dt_txt.slice(0,10);
          if (!days[d]) days[d] = item;
        });
        setForecast(Object.values(days).slice(1,6));
      } catch {}
      setLoading(false);
    };
    fetchWeather();
  }, [open, destCode]);

  const weatherTips = weather ? [
    ...getWeatherTips(weather),
    ...(coords.tips || []).slice(0,1).map(t => ({ icon:"💡", text:t }))
  ] : [];

  return (
    <div className="mw-wrap">
      <style>{CSS}</style>
      <div className="mw-card">

        {/* COLLAPSED BAR */}
        <div className="mw-bar" onClick={() => setOpen(!open)}>
          <div className="mw-bar-left">
            <span style={{ fontSize:16 }}>🗺️</span>
            <span className="mw-bar-title">Mapa y clima</span>
            <span className="mw-bar-sub">· {destName} · datos en vivo</span>
          </div>
          <div className="mw-bar-right">
            {weather && (
              <span style={{ fontSize:13, fontWeight:700, color:"#F0C98A" }}>
                {WEATHER_ICONS[weather.weather?.[0]?.icon] || "🌡️"} {Math.round(weather.main?.temp)}°C
              </span>
            )}
            <div className="mw-live"><span className="mw-live-dot" />En vivo</div>
            <span className={`mw-chevron ${open ? "open" : ""}`}>▾</span>
          </div>
        </div>

        {/* EXPANDABLE */}
        {open && (
          <div className="mw-fu">
            {loading ? (
              <div className="mw-loading">
                <div className="mw-spinner" />
                <div style={{ fontSize:13, color:"rgba(245,239,230,.45)" }}>Cargando clima y mapa...</div>
              </div>
            ) : (
              <>
                {/* WEATHER */}
                {weather && (
                  <div className="mw-weather">
                    <div className="mw-weather-main">
                      <div className="mw-weather-icon">{WEATHER_ICONS[weather.weather?.[0]?.icon] || "🌡️"}</div>
                      <div>
                        <div className="mw-weather-temp">{Math.round(weather.main?.temp)}°C</div>
                        <div className="mw-weather-desc">{weather.weather?.[0]?.description}</div>
                        <div className="mw-weather-loc">📍 {destName}, {destCountry}</div>
                      </div>
                    </div>
                    <div className="mw-weather-stats">
                      {[
                        ["Sensación", `${Math.round(weather.main?.feels_like)}°`],
                        ["Humedad", `${weather.main?.humidity}%`],
                        ["Viento", `${Math.round((weather.wind?.speed||0)*3.6)}km/h`],
                        ["Visibilidad", `${Math.round((weather.visibility||10000)/1000)}km`],
                      ].map(([lbl,val]) => (
                        <div key={lbl} className="mw-stat">
                          <span className="mw-stat-val">{val}</span>
                          <span className="mw-stat-lbl">{lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FORECAST */}
                {forecast.length > 0 && (
                  <div className="mw-forecast">
                    {forecast.map((day, i) => {
                      const date = new Date(day.dt_txt);
                      return (
                        <div key={i} className="mw-day">
                          <div className="mw-day-name">{DAYS[date.getDay()]}</div>
                          <div className="mw-day-icon">{WEATHER_ICONS[day.weather?.[0]?.icon] || "🌡️"}</div>
                          <div className="mw-day-temp">{Math.round(day.main?.temp_max)}°</div>
                          <div className="mw-day-min">{Math.round(day.main?.temp_min)}°</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MAP */}
                <div className="mw-map-wrap">
                  <div ref={mapRef} className="mw-map" />
                  <div className="mw-map-overlay">
                    <div>
                      <div className="mw-map-dest">{destName}</div>
                      <div className="mw-map-country">{destCountry}</div>
                    </div>
                    <span className="mw-map-badge">✦ noma.</span>
                  </div>
                </div>

                {/* TIPS */}
                {weatherTips.length > 0 && (
                  <div className="mw-tips">
                    {weatherTips.map((t, i) => (
                      <div key={i} className="mw-tip">
                        <span>{t.icon}</span>
                        <span>{t.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
