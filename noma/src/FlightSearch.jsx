import { useState, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AIRPORT DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AIRPORTS = [
  { code:"MEX", city:"Ciudad de México", country:"MX", flag:"🇲🇽" },
  { code:"BOG", city:"Bogotá", country:"CO", flag:"🇨🇴" },
  { code:"CTG", city:"Cartagena", country:"CO", flag:"🇨🇴" },
  { code:"MDE", city:"Medellín", country:"CO", flag:"🇨🇴" },
  { code:"LIM", city:"Lima", country:"PE", flag:"🇵🇪" },
  { code:"CUZ", city:"Cusco", country:"PE", flag:"🇵🇪" },
  { code:"EZE", city:"Buenos Aires", country:"AR", flag:"🇦🇷" },
  { code:"GRU", city:"São Paulo", country:"BR", flag:"🇧🇷" },
  { code:"SCL", city:"Santiago", country:"CL", flag:"🇨🇱" },
  { code:"MAD", city:"Madrid", country:"ES", flag:"🇪🇸" },
  { code:"LIS", city:"Lisboa", country:"PT", flag:"🇵🇹" },
  { code:"MIA", city:"Miami", country:"US", flag:"🇺🇸" },
  { code:"JFK", city:"Nueva York", country:"US", flag:"🇺🇸" },
  { code:"NRT", city:"Tokio", country:"JP", flag:"🇯🇵" },
  { code:"CMN", city:"Casablanca", country:"MA", flag:"🇲🇦" },
  { code:"OAX", city:"Oaxaca", country:"MX", flag:"🇲🇽" },
  { code:"SOF", city:"Sofía", country:"BG", flag:"🇧🇬" },
  { code:"DPS", city:"Bali", country:"ID", flag:"🇮🇩" },
];

const AIRLINE_NAMES = {
  AV:"Avianca", CM:"Copa Airlines", P5:"Wingo", AA:"American",
  UA:"United", LA:"LATAM", IB:"Iberia", TP:"TAP Air Portugal",
  AM:"Aeroméxico", VB:"VivaAerobus", Y4:"Volaris", KL:"KLM",
  AF:"Air France", BA:"British Airways", JL:"Japan Airlines",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  .fs-wrap *{box-sizing:border-box;margin:0;padding:0}
  .fs-wrap{font-family:'Instrument Sans',sans-serif;color:#F5EFE6;line-height:1.5}
  .fs-serif{font-family:'Fraunces',serif}

  @keyframes fs-fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes fs-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes fs-pulse{0%,100%{opacity:.5}50%{opacity:1}}
  @keyframes fs-slide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
  @keyframes fs-shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes fs-coralPop{0%{transform:scale(.95);opacity:0}100%{transform:scale(1);opacity:1}}

  .fs-fu{animation:fs-fadeUp .45s cubic-bezier(.23,1,.32,1) both}
  .fs-sl{animation:fs-slide .35s cubic-bezier(.23,1,.32,1) both}

  .fs-card{
    background:linear-gradient(145deg,#1c1610,#141009);
    border:1px solid rgba(255,255,255,.07);
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 32px 80px rgba(0,0,0,.5);
  }

  /* HEADER */
  .fs-header{
    padding:24px 28px 20px;
    background:linear-gradient(135deg,rgba(232,67,45,.1),rgba(212,169,106,.06));
    border-bottom:1px solid rgba(255,255,255,.06);
    display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
  }
  .fs-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#E8432D}
  .fs-live{display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(245,239,230,.5);font-weight:500}
  .fs-live-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80;animation:fs-pulse 2s infinite}

  /* SEARCH FORM */
  .fs-form{padding:22px 28px;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end;border-bottom:1px solid rgba(255,255,255,.05)}
  .fs-field{display:flex;flex-direction:column;gap:6px}
  .fs-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(245,239,230,.4)}
  .fs-select{
    background:#0c0806;border:1.5px solid rgba(255,255,255,.08);
    color:#F5EFE6;padding:12px 16px;border-radius:12px;
    font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:500;
    outline:none;cursor:pointer;transition:border .2s,background .2s;
    appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(245,239,230,.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 14px center;
    padding-right:36px;
  }
  .fs-select:focus{border-color:#E8432D;background-color:#130e09}
  .fs-select option{background:#141009}
  .fs-input{
    background:#0c0806;border:1.5px solid rgba(255,255,255,.08);
    color:#F5EFE6;padding:12px 16px;border-radius:12px;
    font-family:'Instrument Sans',sans-serif;font-size:14px;
    outline:none;transition:border .2s;width:100%;
  }
  .fs-input:focus{border-color:#E8432D}
  .fs-btn{
    background:linear-gradient(135deg,#E8432D,#C73520);
    color:white;border:none;padding:12px 22px;border-radius:12px;
    font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:700;
    cursor:pointer;transition:all .22s;white-space:nowrap;
    display:flex;align-items:center;gap:8px;
  }
  .fs-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(232,67,45,.4)}
  .fs-btn:active{transform:scale(.97)}
  .fs-btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;box-shadow:none!important}

  /* SWAP BUTTON */
  .fs-swap{
    width:36px;height:36px;border-radius:10px;
    background:rgba(232,67,45,.1);border:1px solid rgba(232,67,45,.2);
    color:#E8432D;cursor:pointer;display:flex;align-items:center;justify-content:center;
    font-size:16px;transition:all .2s;align-self:flex-end;margin-bottom:1px;
  }
  .fs-swap:hover{background:rgba(232,67,45,.2);transform:rotate(180deg)}

  /* LOADING */
  .fs-loading{padding:48px 28px;text-align:center}
  .fs-spinner{width:40px;height:40px;border:3px solid rgba(232,67,45,.15);border-top:3px solid #E8432D;border-radius:50%;animation:fs-spin 1s linear infinite;margin:0 auto 16px}
  .fs-loading-text{font-size:14px;color:rgba(245,239,230,.5)}
  .fs-skeleton{height:72px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 100%);background-size:400px 100%;animation:fs-shimmer 1.5s infinite;margin-bottom:10px}

  /* RESULTS */
  .fs-results{padding:20px 28px 24px}
  .fs-results-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px}
  .fs-results-title{font-size:13px;color:rgba(245,239,230,.5)}
  .fs-results-route{font-family:'Fraunces',serif;font-size:20px;font-weight:700;letter-spacing:-.5px}
  .fs-sort{display:flex;gap:6px}
  .fs-sort-btn{padding:5px 12px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,.08);background:transparent;color:rgba(245,239,230,.5);transition:all .2s;font-family:'Instrument Sans',sans-serif}
  .fs-sort-btn.active{background:rgba(232,67,45,.12);border-color:rgba(232,67,45,.3);color:#E8432D}

  /* FLIGHT CARD */
  .fs-flight{
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
    border-radius:16px;padding:18px 20px;margin-bottom:10px;
    display:grid;grid-template-columns:auto 1fr auto auto;gap:16px;align-items:center;
    transition:all .25s cubic-bezier(.23,1,.32,1);cursor:pointer;
    animation:fs-coralPop .4s ease both;
  }
  .fs-flight:hover{border-color:rgba(232,67,45,.25);background:rgba(232,67,45,.04);transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.3)}
  .fs-flight.best{border-color:rgba(232,67,45,.3);background:rgba(232,67,45,.06)}
  .fs-flight.best::before{content:'MEJOR PRECIO';position:absolute;top:-1px;left:16px;background:linear-gradient(135deg,#E8432D,#C73520);color:white;font-size:9px;font-weight:700;padding:3px 10px;border-radius:0 0 8px 8px;letter-spacing:.8px}

  .fs-airline-logo{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:rgba(245,239,230,.7);flex-shrink:0;border:1px solid rgba(255,255,255,.06);letter-spacing:-.5px}
  .fs-flight-info{min-width:0}
  .fs-airline-name{font-size:12px;color:rgba(245,239,230,.5);margin-bottom:5px;font-weight:500}
  .fs-times{display:flex;align-items:center;gap:10px}
  .fs-time{font-family:'Fraunces',serif;font-size:22px;font-weight:700;letter-spacing:-1px}
  .fs-route-line{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 8px}
  .fs-duration{font-size:10px;color:rgba(245,239,230,.4);font-weight:600;text-transform:uppercase;letter-spacing:.5px}
  .fs-line{width:100%;height:1px;background:linear-gradient(90deg,rgba(232,67,45,.3),rgba(212,169,106,.3));position:relative}
  .fs-line::after{content:'✈';position:absolute;right:-4px;top:50%;transform:translateY(-50%);font-size:10px;color:#E8432D}
  .fs-stops{font-size:10px;color:rgba(245,239,230,.35);text-align:center}

  .fs-meta{text-align:right}
  .fs-stops-badge{font-size:10px;padding:3px 8px;border-radius:100px;font-weight:700;margin-bottom:6px;display:inline-block}
  .fs-direct{background:rgba(74,222,128,.1);color:#4ade80;border:1px solid rgba(74,222,128,.2)}
  .fs-one-stop{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2)}
  .fs-multi{background:rgba(244,63,94,.1);color:#f87171;border:1px solid rgba(244,63,94,.2)}
  .fs-baggage{font-size:10px;color:rgba(245,239,230,.35)}

  .fs-price-wrap{text-align:right;flex-shrink:0}
  .fs-price{font-family:'Fraunces',serif;font-size:26px;font-weight:900;letter-spacing:-1px;background:linear-gradient(135deg,#E8432D,#FF8C6E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .fs-price-label{font-size:10px;color:rgba(245,239,230,.35);margin-top:2px}
  .fs-book-btn{margin-top:8px;padding:7px 14px;border-radius:8px;background:linear-gradient(135deg,#E8432D,#C73520);color:white;font-size:11px;font-weight:700;border:none;cursor:pointer;font-family:'Instrument Sans',sans-serif;transition:all .2s;display:block;text-align:center}
  .fs-book-btn:hover{transform:scale(1.04);box-shadow:0 6px 18px rgba(232,67,45,.35)}

  /* EXCHANGE WIDGET */
  .fs-exchange{
    margin:0 28px 24px;padding:16px 20px;
    background:rgba(212,169,106,.06);border:1px solid rgba(212,169,106,.15);
    border-radius:14px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;
  }
  .fs-ex-icon{font-size:22px}
  .fs-ex-content{flex:1;min-width:200px}
  .fs-ex-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(212,169,106,.7);margin-bottom:4px}
  .fs-ex-rate{font-family:'Fraunces',serif;font-size:18px;font-weight:700;color:#F0C98A}
  .fs-ex-updated{font-size:10px;color:rgba(245,239,230,.3);margin-top:2px}
  .fs-ex-pairs{display:flex;gap:8px;flex-wrap:wrap}
  .fs-ex-pair{padding:5px 11px;border-radius:8px;background:rgba(212,169,106,.08);border:1px solid rgba(212,169,106,.12);font-size:12px;font-weight:600;color:#F0C98A;cursor:pointer;transition:all .2s}
  .fs-ex-pair:hover,.fs-ex-pair.active{background:rgba(212,169,106,.18);border-color:rgba(212,169,106,.3)}

  /* ERROR */
  .fs-error{padding:32px 28px;text-align:center}
  .fs-error-icon{font-size:40px;margin-bottom:12px}
  .fs-error-text{font-size:14px;color:rgba(245,239,230,.5);line-height:1.6}
  .fs-error-text strong{color:#F5EFE6}

  /* EMPTY */
  .fs-empty{padding:48px 28px;text-align:center}
  .fs-empty-icon{font-size:48px;margin-bottom:16px}
  .fs-empty-text{font-size:15px;color:rgba(245,239,230,.5);line-height:1.7}

  /* SUMMARY BAR */
  .fs-summary{
    padding:14px 28px;background:rgba(255,255,255,.025);
    border-top:1px solid rgba(255,255,255,.05);
    display:flex;gap:20px;align-items:center;flex-wrap:wrap;
  }
  .fs-sum-item{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(245,239,230,.5)}
  .fs-sum-val{font-weight:700;color:#F5EFE6}

  @media(max-width:640px){
    .fs-form{grid-template-columns:1fr 1fr;gap:10px}
    .fs-btn{grid-column:1/-1}
    .fs-flight{grid-template-columns:auto 1fr;gap:12px}
    .fs-price-wrap{grid-column:2;text-align:left}
    .fs-meta{display:none}
    .fs-header{padding:18px 20px}
    .fs-results{padding:16px 20px 20px}
    .fs-exchange{margin:0 20px 20px}
  }
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const fmt = (n) => new Intl.NumberFormat("es-MX", { style:"currency", currency:"USD", minimumFractionDigits:0 }).format(n);
const fmtDuration = (iso) => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const h = m?.[1] || "0", min = m?.[2] || "0";
  return `${h}h ${min}m`;
};
const fmtTime = (dt) => dt ? dt.slice(11,16) : "--:--";
const today = () => new Date().toISOString().slice(0,10);
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().slice(0,10); };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FLIGHT CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function FlightCard({ offer, idx, isBest }) {
  const seg = offer.itineraries[0].segments;
  const first = seg[0];
  const last = seg[seg.length - 1];
  const stops = seg.length - 1;
  const duration = offer.itineraries[0].duration;
  const price = parseFloat(offer.price.total);
  const carrier = first.carrierCode;
  const airlineName = AIRLINE_NAMES[carrier] || carrier;

  return (
    <div className={`fs-flight ${isBest ? "best" : ""}`}
      style={{ animationDelay:`${idx * 0.06}s`, position:"relative" }}>
      {/* Airline */}
      <div className="fs-airline-logo">{carrier}</div>

      {/* Route */}
      <div className="fs-flight-info">
        <div className="fs-airline-name">{airlineName}</div>
        <div className="fs-times">
          <span className="fs-time">{fmtTime(first.departure.at)}</span>
          <div className="fs-route-line">
            <span className="fs-duration">{fmtDuration(duration)}</span>
            <div className="fs-line" />
            <span className="fs-stops">
              {stops === 0 ? "directo" : stops === 1 ? `1 escala · ${seg[0].arrival.iataCode}` : `${stops} escalas`}
            </span>
          </div>
          <span className="fs-time">{fmtTime(last.arrival.at)}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="fs-meta">
        <span className={`fs-stops-badge ${stops === 0 ? "fs-direct" : stops === 1 ? "fs-one-stop" : "fs-multi"}`}>
          {stops === 0 ? "✓ Directo" : stops === 1 ? "1 escala" : `${stops} escalas`}
        </span>
        <div className="fs-baggage">
          {offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin === "BUSINESS" ? "✦ Business" : "Cabina economy"}
        </div>
      </div>

      {/* Price */}
      <div className="fs-price-wrap">
        <div className="fs-price">{fmt(price)}</div>
        <div className="fs-price-label">por persona · USD</div>
        <button className="fs-book-btn"
          onClick={() => window.open(`https://www.google.com/flights?hl=es#flt=${first.departure.iataCode}.${last.arrival.iataCode}.${first.departure.at.slice(0,10)}`, "_blank")}>
          Ver vuelo →
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXCHANGE WIDGET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ExchangeWidget({ destination }) {
  const [rates, setRates] = useState({});
  const [active, setActive] = useState(null);
  const PAIRS = [
    { from:"USD", to:"COP", label:"USD → COP" },
    { from:"USD", to:"MXN", label:"USD → MXN" },
    { from:"USD", to:"PEN", label:"USD → PEN" },
    { from:"USD", to:"ARS", label:"USD → ARS" },
    { from:"EUR", to:"USD", label:"EUR → USD" },
  ];

  const fetchRate = async (from, to) => {
    if (rates[`${from}-${to}`]) { setActive(`${from}-${to}`); return; }
    try {
      const res = await fetch(`/api/exchange?from=${from}&to=${to}`);
      const data = await res.json();
      if (data.conversion_rate) {
        setRates(r => ({ ...r, [`${from}-${to}`]: data.conversion_rate }));
        setActive(`${from}-${to}`);
      }
    } catch {}
  };

  useEffect(() => { fetchRate("USD", "COP"); }, []);

  return (
    <div className="fs-exchange">
      <span className="fs-ex-icon">💱</span>
      <div className="fs-ex-content">
        <div className="fs-ex-title">Tipo de cambio en vivo</div>
        {active && rates[active] ? (
          <>
            <div className="fs-ex-rate">
              1 {active.split("-")[0]} = {rates[active].toLocaleString("es-MX", { minimumFractionDigits:2, maximumFractionDigits:2 })} {active.split("-")[1]}
            </div>
            <div className="fs-ex-updated">Actualizado ahora · ExchangeRate API</div>
          </>
        ) : (
          <div className="fs-ex-rate" style={{ opacity:.5, fontSize:14 }}>Cargando...</div>
        )}
      </div>
      <div className="fs-ex-pairs">
        {PAIRS.map(p => (
          <button key={`${p.from}-${p.to}`}
            className={`fs-ex-pair ${active === `${p.from}-${p.to}` ? "active" : ""}`}
            onClick={() => fetchRate(p.from, p.to)}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function FlightSearch({ defaultOrigin = "MEX", defaultDest = "CTG" }) {
  const [origin, setOrigin] = useState(defaultOrigin);
  const [dest, setDest] = useState(defaultDest);
  const [date, setDate] = useState(addDays(today(), 30));
  const [flights, setFlights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("price");
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);

  const search = async () => {
    if (origin === dest) return;
    setLoading(true);
    setError(null);
    setFlights(null);
    setSearched(true);
    try {
      const res = await fetch("/api/flights", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ origin, destination:dest, date })
      });
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setFlights(data.data);
      } else if (data.errors) {
        setError(data.errors[0]?.detail || "No se encontraron vuelos para esta ruta.");
      } else {
        setFlights([]);
      }
    } catch (e) {
      setError("No se pudo conectar con el buscador de vuelos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setOrigin(dest); setDest(origin); };

  const sorted = flights ? [...flights].sort((a, b) => {
    if (sort === "price") return parseFloat(a.price.total) - parseFloat(b.price.total);
    if (sort === "duration") {
      const dur = f => { const m = f.itineraries[0].duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/); return (parseInt(m?.[1]||0)*60)+parseInt(m?.[2]||0); };
      return dur(a) - dur(b);
    }
    return 0;
  }) : [];

  const cheapest = sorted[0] ? parseFloat(sorted[0].price.total) : null;
  const origAirport = AIRPORTS.find(a => a.code === origin);
  const destAirport = AIRPORTS.find(a => a.code === dest);

  return (
    <div className="fs-wrap">
      <style>{CSS}</style>
      <div className="fs-card">

        {/* COLLAPSED BAR */}
        <div onClick={() => setOpen(!open)} style={{
          padding:"12px 18px", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          borderBottom: open ? "1px solid rgba(255,255,255,.06)" : "none",
          transition:"all .2s"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:16 }}>✈️</span>
            <span style={{ fontSize:12, fontWeight:700, color:"#E8432D", textTransform:"uppercase", letterSpacing:2 }}>Buscar vuelos</span>
            <span style={{ fontSize:11, color:"rgba(245,239,230,.4)" }}>· Amadeus · datos en vivo</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div className="fs-live"><span className="fs-live-dot" />En vivo</div>
            <span style={{ color:"rgba(245,239,230,.4)", fontSize:14, transition:"transform .2s", display:"inline-block", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
          </div>
        </div>

        {/* EXPANDABLE CONTENT */}
        {open && <>

        {/* FORM */}
        <div className="fs-form">
          <div className="fs-field">
            <label className="fs-label">Origen</label>
            <select className="fs-select" value={origin} onChange={e => setOrigin(e.target.value)}>
              {AIRPORTS.map(a => (
                <option key={a.code} value={a.code}>{a.flag} {a.city} ({a.code})</option>
              ))}
            </select>
          </div>

          <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
            <button className="fs-swap" onClick={swap} title="Invertir ruta">⇄</button>
            <div className="fs-field" style={{ flex:1 }}>
              <label className="fs-label">Destino</label>
              <select className="fs-select" value={dest} onChange={e => setDest(e.target.value)}>
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code}>{a.flag} {a.city} ({a.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="fs-field">
            <label className="fs-label">Fecha de salida</label>
            <input type="date" className="fs-input" value={date}
              min={addDays(today(), 1)}
              onChange={e => setDate(e.target.value)}
              style={{ colorScheme:"dark" }} />
          </div>

          <button className="fs-btn" onClick={search} disabled={loading || origin === dest}>
            {loading
              ? <span style={{ display:"inline-block", animation:"fs-spin 1s linear infinite" }}>⟳</span>
              : "✦"
            }
            {loading ? "Buscando..." : "Buscar vuelos"}
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="fs-loading">
            <div className="fs-spinner" />
            <div className="fs-loading-text">
              Consultando {AIRLINES_COUNT} aerolíneas en tiempo real...
            </div>
            <div style={{ marginTop:20, padding:"0 20px" }}>
              {[1,2,3].map(i => <div key={i} className="fs-skeleton" style={{ animationDelay:`${i*.15}s` }} />)}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {!loading && sorted.length > 0 && (
          <>
            <div className="fs-results">
              <div className="fs-results-header">
                <div>
                  <div className="fs-results-title">{sorted.length} vuelos encontrados</div>
                  <div className="fs-results-route fs-serif">
                    {origAirport?.flag} {origAirport?.city} → {destAirport?.flag} {destAirport?.city}
                  </div>
                </div>
                <div className="fs-sort">
                  {[["price","💰 Precio"],["duration","⏱ Duración"]].map(([k,lbl]) => (
                    <button key={k} className={`fs-sort-btn ${sort===k?"active":""}`} onClick={() => setSort(k)}>{lbl}</button>
                  ))}
                </div>
              </div>

              {sorted.map((offer, i) => (
                <FlightCard key={offer.id} offer={offer} idx={i} isBest={i===0} />
              ))}
            </div>

            {/* SUMMARY */}
            <div className="fs-summary">
              {[
                ["✈️ Vuelos encontrados", sorted.length],
                ["💰 Desde", cheapest ? fmt(cheapest) : "—"],
                ["📅 Fecha", new Date(date+"T12:00:00").toLocaleDateString("es-MX",{day:"numeric",month:"long"})],
                ["🔄 Fuente", "Amadeus · datos en vivo"],
              ].map(([lbl, val]) => (
                <div key={lbl} className="fs-sum-item">
                  <span>{lbl}:</span><span className="fs-sum-val">{val}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* EMPTY */}
        {!loading && searched && flights && flights.length === 0 && (
          <div className="fs-empty">
            <div className="fs-empty-icon">🔍</div>
            <div className="fs-empty-text">
              <strong>No encontramos vuelos disponibles</strong><br/>
              para esta ruta en esa fecha.<br/>
              Intenta con fechas alternativas o una ruta diferente.
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="fs-error">
            <div className="fs-error-icon">⚠️</div>
            <div className="fs-error-text">
              <strong>No pudimos buscar vuelos</strong><br/>
              {error}
            </div>
          </div>
        )}

        {/* DEFAULT STATE */}
        {!loading && !searched && (
          <div className="fs-empty" style={{ paddingTop:36, paddingBottom:36 }}>
            <div style={{ fontSize:44, marginBottom:14 }}>✈️</div>
            <div className="fs-empty-text">
              <strong style={{ color:"#F5EFE6", fontSize:16 }}>Busca vuelos en tiempo real</strong><br/>
              Datos de Amadeus · Más de 500 aerolíneas · Precios actualizados al instante
            </div>
          </div>
        )}

        {/* EXCHANGE */}
        <ExchangeWidget destination={dest} />

        </>}
      </div>
    </div>
  );
}

// Dummy constant to avoid reference error
const AIRLINES_COUNT = 500;
