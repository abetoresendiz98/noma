import { useState } from "react";

const CSS = `
.hs-wrap *{box-sizing:border-box;margin:0;padding:0}
.hs-wrap{font-family:'Instrument Sans',sans-serif;color:#F5EFE6;line-height:1.5}

@keyframes hs-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes hs-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes hs-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.hs-fu{animation:hs-fadeUp .35s cubic-bezier(.23,1,.32,1) both}

.hs-card{
  background:linear-gradient(145deg,#1c1610,#141009);
  border:1px solid rgba(255,255,255,.07);
  border-radius:24px;overflow:hidden;
  box-shadow:0 24px 60px rgba(0,0,0,.45);
}

/* BAR */
.hs-bar{
  padding:12px 18px;cursor:pointer;
  display:flex;align-items:center;justify-content:space-between;
  transition:background .2s;
}
.hs-bar:hover{background:rgba(255,255,255,.02)}
.hs-bar-left{display:flex;align-items:center;gap:10px}
.hs-bar-title{font-size:12px;font-weight:700;color:#E8432D;text-transform:uppercase;letter-spacing:2px}
.hs-bar-sub{font-size:11px;color:rgba(245,239,230,.4)}
.hs-live{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(245,239,230,.5)}
.hs-live-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80;animation:hs-pulse 2s infinite}
.hs-chevron{color:rgba(245,239,230,.4);font-size:13px;transition:transform .25s}
.hs-chevron.open{transform:rotate(180deg)}

/* FORM */
.hs-form{
  padding:16px 20px;
  border-bottom:1px solid rgba(255,255,255,.05);
  display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:flex-end;
}
@media(max-width:600px){.hs-form{grid-template-columns:1fr 1fr}}
.hs-field{display:flex;flex-direction:column;gap:5px}
.hs-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(245,239,230,.4)}
.hs-input{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  border-radius:10px;padding:10px 12px;color:#F5EFE6;font-size:13px;
  font-family:'Instrument Sans',sans-serif;outline:none;transition:all .2s;
  width:100%;
}
.hs-input:focus{border-color:rgba(232,67,45,.4);background:rgba(232,67,45,.05)}
.hs-input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.5)}
.hs-btn{
  background:linear-gradient(135deg,#E8432D,#C73520);
  border:none;border-radius:10px;padding:10px 18px;
  color:#fff;font-size:13px;font-weight:700;cursor:pointer;
  font-family:'Instrument Sans',sans-serif;white-space:nowrap;
  transition:all .2s;letter-spacing:.5px;
}
.hs-btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(232,67,45,.35)}
.hs-btn:disabled{opacity:.5;cursor:default;transform:none}

/* RESULTS */
.hs-results{padding:16px 20px;display:flex;flex-direction:column;gap:12px}

.hs-hotel{
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
  border-radius:16px;padding:16px;display:flex;gap:14px;align-items:flex-start;
  transition:all .2s;cursor:pointer;text-decoration:none;
}
.hs-hotel:hover{background:rgba(232,67,45,.05);border-color:rgba(232,67,45,.2);transform:translateY(-2px)}

.hs-hotel-img{
  width:80px;height:80px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.05);
}
.hs-hotel-img-placeholder{
  width:80px;height:80px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(232,67,45,.1),rgba(212,169,106,.08));
  display:flex;align-items:center;justify-content:center;font-size:28px;
}

.hs-hotel-info{flex:1;min-width:0}
.hs-hotel-name{font-family:'Fraunces',serif;font-size:15px;font-weight:700;color:#F5EFE6;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hs-hotel-loc{font-size:11px;color:rgba(245,239,230,.45);margin-bottom:6px}
.hs-hotel-stars{color:#F0C98A;font-size:12px;margin-bottom:6px}
.hs-hotel-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.hs-badge{padding:3px 8px;border-radius:100px;font-size:10px;font-weight:700}
.hs-badge-green{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);color:#4ade80}
.hs-badge-coral{background:rgba(232,67,45,.1);border:1px solid rgba(232,67,45,.2);color:#E8432D}
.hs-badge-sand{background:rgba(212,169,106,.1);border:1px solid rgba(212,169,106,.2);color:#D4A96A}

.hs-hotel-price{text-align:right;flex-shrink:0}
.hs-price-val{font-family:'Fraunces',serif;font-size:22px;font-weight:900;background:linear-gradient(135deg,#E8432D,#FF8C6E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hs-price-night{font-size:10px;color:rgba(245,239,230,.35);text-transform:uppercase;letter-spacing:1px}
.hs-price-total{font-size:11px;color:rgba(245,239,230,.4);margin-top:2px}
.hs-book-btn{
  margin-top:8px;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;
  background:linear-gradient(135deg,#E8432D,#C73520);color:#fff;border:none;cursor:pointer;
  font-family:'Instrument Sans',sans-serif;width:100%;
}

/* RATING */
.hs-rating{display:flex;align-items:center;gap:5px}
.hs-rating-val{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#E8432D,#C73520);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff}
.hs-rating-text{font-size:11px;color:rgba(245,239,230,.5)}

/* STATES */
.hs-loading{padding:40px;text-align:center}
.hs-spinner{width:32px;height:32px;border:2.5px solid rgba(232,67,45,.15);border-top:2.5px solid #E8432D;border-radius:50%;animation:hs-spin 1s linear infinite;margin:0 auto 12px}
.hs-empty{padding:40px;text-align:center}
.hs-empty-icon{font-size:40px;margin-bottom:12px}
.hs-empty-text{font-size:14px;color:rgba(245,239,230,.5)}
.hs-error{padding:20px;text-align:center;color:rgba(232,67,45,.8);font-size:13px}

/* SORT */
.hs-sort{display:flex;gap:8px;padding:12px 20px 0;flex-wrap:wrap}
.hs-sort-btn{padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(245,239,230,.5);cursor:pointer;font-family:'Instrument Sans',sans-serif;transition:all .2s}
.hs-sort-btn.active{background:rgba(232,67,45,.1);border-color:rgba(232,67,45,.3);color:#E8432D}

/* SUMMARY */
.hs-summary{padding:12px 20px;font-size:12px;color:rgba(245,239,230,.4);border-bottom:1px solid rgba(255,255,255,.04)}
`;

function today() {
  return new Date().toISOString().slice(0,10);
}
function addDays(d, n) {
  const dt = new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().slice(0,10);
}
function nights(ci, co) {
  return Math.round((new Date(co)-new Date(ci))/(1000*60*60*24));
}
function stars(n) {
  return "★".repeat(Math.min(5,Math.round(n||0))) + "☆".repeat(Math.max(0,5-Math.round(n||0)));
}
function ratingLabel(score) {
  if (score >= 9) return "Excepcional";
  if (score >= 8) return "Excelente";
  if (score >= 7) return "Muy bueno";
  if (score >= 6) return "Bueno";
  return "Aceptable";
}

export default function HotelSearch({ destination }) {
  const destName = destination?.name || "Cartagena";
  const [checkIn, setCheckIn] = useState(addDays(today(), 30));
  const [checkOut, setCheckOut] = useState(addDays(today(), 35));
  const [adults, setAdults] = useState(2);
  const [hotels, setHotels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("recommended");
  const [open, setOpen] = useState(false);

  const search = async () => {
    if (!checkIn || !checkOut) return;
    setLoading(true);
    setError(null);
    setHotels(null);
    try {
      const res = await fetch(
        `/api/hotels?location=${encodeURIComponent(destName)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`
      );
      const data = await res.json();
      const props = data?.data?.propertySearch?.properties || [];
      setHotels(props);
    } catch(e) {
      setError("No pudimos buscar hoteles. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const sorted = hotels ? [...hotels].sort((a,b) => {
    if (sort === "price") return (a.price?.lead?.amount||999) - (b.price?.lead?.amount||999);
    if (sort === "rating") return (b.reviews?.score||0) - (a.reviews?.score||0);
    return 0;
  }) : [];

  const n = nights(checkIn, checkOut);

  return (
    <div className="hs-wrap">
      <style>{CSS}</style>
      <div className="hs-card">

        {/* BAR */}
        <div className="hs-bar" onClick={() => setOpen(!open)}>
          <div className="hs-bar-left">
            <span style={{ fontSize:16 }}>🏨</span>
            <span className="hs-bar-title">Buscar hoteles</span>
            <span className="hs-bar-sub">· Hotels.com · datos en vivo</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div className="hs-live"><span className="hs-live-dot" />En vivo</div>
            <span className={`hs-chevron ${open?"open":""}`}>▾</span>
          </div>
        </div>

        {open && (
          <div className="hs-fu">

            {/* FORM */}
            <div className="hs-form">
              <div className="hs-field">
                <label className="hs-label">Check-in</label>
                <input className="hs-input" type="date" value={checkIn} min={today()} onChange={e=>setCheckIn(e.target.value)} />
              </div>
              <div className="hs-field">
                <label className="hs-label">Check-out</label>
                <input className="hs-input" type="date" value={checkOut} min={checkIn} onChange={e=>setCheckOut(e.target.value)} />
              </div>
              <div className="hs-field">
                <label className="hs-label">Huéspedes</label>
                <select className="hs-input" value={adults} onChange={e=>setAdults(e.target.value)}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n===1?"adulto":"adultos"}</option>)}
                </select>
              </div>
              <button className="hs-btn" onClick={search} disabled={loading}>
                {loading ? "..." : "🔍 Buscar"}
              </button>
            </div>

            {/* SORT */}
            {hotels && hotels.length > 0 && (
              <div className="hs-sort">
                <span style={{ fontSize:11, color:"rgba(245,239,230,.4)", alignSelf:"center" }}>Ordenar:</span>
                {[["recommended","✦ Recomendados"],["price","💰 Precio"],["rating","⭐ Calificación"]].map(([val,lbl])=>(
                  <button key={val} className={`hs-sort-btn ${sort===val?"active":""}`} onClick={()=>setSort(val)}>{lbl}</button>
                ))}
              </div>
            )}

            {/* SUMMARY */}
            {hotels && (
              <div className="hs-summary">
                {sorted.length} hoteles en <strong style={{color:"#F5EFE6"}}>{destName}</strong> · {n} {n===1?"noche":"noches"} · {adults} {adults==1?"adulto":"adultos"}
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="hs-loading">
                <div className="hs-spinner" />
                <div style={{ fontSize:13, color:"rgba(245,239,230,.45)" }}>Buscando hoteles en {destName}...</div>
              </div>
            )}

            {/* ERROR */}
            {error && <div className="hs-error">⚠️ {error}</div>}

            {/* EMPTY */}
            {hotels && hotels.length === 0 && !loading && (
              <div className="hs-empty">
                <div className="hs-empty-icon">🏨</div>
                <div className="hs-empty-text">No encontramos hoteles disponibles.<br/>Prueba otras fechas.</div>
              </div>
            )}

            {/* INITIAL STATE */}
            {!hotels && !loading && !error && (
              <div className="hs-empty">
                <div className="hs-empty-icon">🏨</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#F5EFE6", marginBottom:6 }}>Encuentra tu hotel ideal</div>
                <div className="hs-empty-text">Mejores precios garantizados · Miles de opciones</div>
              </div>
            )}

            {/* RESULTS */}
            {sorted.length > 0 && (
              <div className="hs-results">
                {sorted.slice(0,8).map((hotel, i) => {
                  const price = hotel.price?.lead?.amount;
                  const total = price ? Math.round(price * n) : null;
                  const rating = hotel.reviews?.score;
                  const reviews = hotel.reviews?.total;
                  const imgUrl = hotel.propertyImage?.image?.url;
                  const hotelUrl = `https://www.hotels.com/ho${hotel.id}`;

                  return (
                    <a key={hotel.id || i} className="hs-hotel" href={hotelUrl} target="_blank" rel="noopener noreferrer">
                      {imgUrl
                        ? <img className="hs-hotel-img" src={imgUrl} alt={hotel.name} onError={e=>e.target.style.display="none"} />
                        : <div className="hs-hotel-img-placeholder">🏨</div>
                      }

                      <div className="hs-hotel-info">
                        <div className="hs-hotel-name">{hotel.name}</div>
                        <div className="hs-hotel-loc">📍 {destName}</div>
                        {hotel.star && <div className="hs-hotel-stars">{stars(hotel.star)}</div>}
                        <div className="hs-hotel-badges">
                          {i === 0 && price && <span className="hs-badge hs-badge-coral">✦ Mejor precio</span>}
                          {rating >= 9 && <span className="hs-badge hs-badge-green">Excepcional</span>}
                          {hotel.availability?.available && <span className="hs-badge hs-badge-sand">Disponible</span>}
                        </div>
                        {rating && (
                          <div className="hs-rating">
                            <div className="hs-rating-val">{rating.toFixed(1)}</div>
                            <div className="hs-rating-text">{ratingLabel(rating)}{reviews ? ` · ${reviews.toLocaleString()} reseñas` : ""}</div>
                          </div>
                        )}
                      </div>

                      <div className="hs-hotel-price">
                        {price && (
                          <>
                            <div className="hs-price-val">${Math.round(price)}</div>
                            <div className="hs-price-night">por noche</div>
                            {total && <div className="hs-price-total">${total.toLocaleString()} total</div>}
                          </>
                        )}
                        <button className="hs-book-btn" onClick={e=>{e.preventDefault();window.open(hotelUrl,"_blank")}}>
                          Ver hotel →
                        </button>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
