import { useState, useEffect } from 'react';

export default function SavedTrips({ onClose, onLoadTrip }) {
  const [trips, setTrips] = useState([]);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('noma_trips') || '[]');
    setTrips(saved.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const deleteTrip = (id) => {
    const updated = trips.filter(t => t.id !== id);
    localStorage.setItem('noma_trips', JSON.stringify(updated));
    setTrips(updated);
  };

  const shareWhatsApp = (trip) => {
    const text = `🧭 *Mi viaje a ${trip.destination} con noma.*\n\n` +
      `💰 Presupuesto: ${trip.budget}\n` +
      `📅 ${trip.days} días\n\n` +
      `Itinerario:\n${trip.summary}\n\n` +
      `Planeado con noma. 🌍`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (trips.length === 0) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(12,8,6,0.95)', zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 40
      }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🧳</div>
        <h2 style={{ color: '#f5f2ed', marginBottom: 10 }}>No tienes viajes guardados</h2>
        <p style={{ color: '#a89f91', textAlign: 'center', maxWidth: 300 }}>
          Cuando la IA te genere un itinerario, podrás guardarlo aquí
        </p>
        <button onClick={onClose} style={{
          marginTop: 30, padding: '12px 24px', background: '#E8432D',
          color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer'
        }}>Cerrar</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(12,8,6,0.98)', zIndex: 100,
      padding: '80px 20px 20px', overflowY: 'auto'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#f5f2ed', margin: 0 }}>🧳 Mis viajes guardados</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#a89f91',
            fontSize: 24, cursor: 'pointer'
          }}>×</button>
        </div>

        {trips.map(trip => (
          <div key={trip.id} style={{
            background: 'rgba(245,242,237,0.05)',
            border: '1px solid rgba(232,67,45,0.2)',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f5f2ed' }}>
                  {trip.destination}
                </div>
                <div style={{ fontSize: 13, color: '#a89f91', marginTop: 4 }}>
                  {new Date(trip.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', month: 'short', year: 'numeric' 
                  })} · {trip.days} días · {trip.budget}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => shareWhatsApp(trip)}
                  style={{
                    background: '#25D366', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600
                  }}
                >
                  📱 WhatsApp
                </button>
                <button 
                  onClick={() => deleteTrip(trip.id)}
                  style={{
                    background: 'rgba(232,67,45,0.2)', color: '#E8432D',
                    border: 'none', borderRadius: 8, padding: '8px',
                    cursor: 'pointer', fontSize: 12
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p style={{ 
              color: '#a89f91', fontSize: 14, lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
              margin: 0
            }}>
              {trip.summary}
            </p>

            <button 
              onClick={() => onLoadTrip(trip)}
              style={{
                width: '100%', marginTop: 12, padding: '10px',
                background: 'transparent', color: '#EAA000',
                border: '1px solid rgba(234,160,0,0.3)', borderRadius: 8,
                cursor: 'pointer', fontSize: 13
              }}
            >
              Ver itinerario completo →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
