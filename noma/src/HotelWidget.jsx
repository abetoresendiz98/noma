import { useState } from 'react';

const hotelsDB = {
  "Cartagena": [
    { id: 1, name: "Casa Lola", type: "boutique", price: 85, rating: 9.2, reviews: 420, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/co/casa-lola.html" },
    { id: 2, name: "Selina Cartagena", type: "hostal", price: 35, rating: 8.5, reviews: 890, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/co/selina-cartagena.html" },
    { id: 3, name: "Sofitel Legend", type: "lujo", price: 280, rating: 9.6, reviews: 320, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/co/sofitel-legend-santa-clara.html" }
  ],
  "Lisboa": [
    { id: 4, name: "The Independente", type: "boutique", price: 95, rating: 9.0, reviews: 2100, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", link: "https://www.booking.com/hotel/pt/the-independente.html" },
    { id: 5, name: "Home Lisbon Hostel", type: "hostal", price: 28, rating: 9.4, reviews: 3400, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/pt/home-lisbon-hostel.html" },
    { id: 6, name: "Pestana Palace", type: "lujo", price: 220, rating: 9.3, reviews: 890, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/pt/pestana-palace-lisboa.html" }
  ],
  "Cusco": [
    { id: 7, name: "El Mercado Tunqui", type: "boutique", price: 75, rating: 9.5, reviews: 650, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/pe/tunqui.html" },
    { id: 8, name: "Pariwana Hostel", type: "hostal", price: 18, rating: 8.8, reviews: 1200, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/pe/pariwana.html" },
    { id: 9, name: "Belmond Palacio", type: "lujo", price: 450, rating: 9.8, reviews: 280, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/pe/belmond-palacio-nazarenas.html" }
  ],
  "Oaxaca": [
    { id: 10, name: "Casa Antonieta", type: "boutique", price: 110, rating: 9.3, reviews: 340, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/mx/casa-antonieta.html" },
    { id: 11, name: "Hostal Central", type: "hostal", price: 25, rating: 8.7, reviews: 780, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/mx/hostal-central.html" },
    { id: 12, name: "Quinta Real", type: "lujo", price: 180, rating: 9.1, reviews: 420, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/mx/quinta-real-oaxaca.html" }
  ],
  "Plovdiv": [
    { id: 13, name: "Hotel Ego", type: "boutique", price: 55, rating: 9.0, reviews: 280, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/bg/ego.html" },
    { id: 14, name: "Hostel Old Plovdiv", type: "hostal", price: 22, rating: 8.9, reviews: 450, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/bg/old-plovdiv.html" }
  ],
  "Medellín": [
    { id: 15, name: "The Charlee", type: "boutique", price: 120, rating: 9.2, reviews: 890, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/co/the-charlee.html" },
    { id: 16, name: "Los Patios Hostel", type: "hostal", price: 30, rating: 9.1, reviews: 1100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/co/los-patios.html" },
    { id: 17, name: "El Cielo", type: "lujo", price: 200, rating: 9.4, reviews: 320, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/co/el-cielo.html" }
  ],
  "Tokio": [
    { id: 18, name: "Hotel K5", type: "boutique", price: 180, rating: 9.0, reviews: 540, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/jp/k5.html" },
    { id: 19, name: "Sakura Hostel", type: "hostal", price: 45, rating: 8.6, reviews: 2100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/jp/sakura.html" },
    { id: 20, name: "Aman Tokyo", type: "lujo", price: 950, rating: 9.7, reviews: 180, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/jp/aman-tokyo.html" }
  ],
  "Fez": [
    { id: 21, name: "Riad Fes", type: "boutique", price: 140, rating: 9.3, reviews: 420, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ma/riad-fes.html" },
    { id: 22, name: "Medina Hostel", type: "hostal", price: 20, rating: 8.4, reviews: 650, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ma/medina-hostel.html" }
  ],
  "Buenos Aires": [
    { id: 23, name: "Hotel Pulitzer", type: "boutique", price: 130, rating: 9.1, reviews: 780, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ar/pulitzer-buenos-aires.html" },
    { id: 24, name: "Milhouse Hostel", type: "hostal", price: 28, rating: 8.9, reviews: 1500, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ar/milhouse.html" },
    { id: 25, name: "Alvear Palace", type: "lujo", price: 380, rating: 9.6, reviews: 450, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/ar/alvear-palace.html" }
  ],
  "Bali": [
    { id: 26, name: "Bambu Indah", type: "boutique", price: 160, rating: 9.4, reviews: 380, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/id/bambu-indah.html" },
    { id: 27, name: "Puri Garden", type: "hostal", price: 35, rating: 9.2, reviews: 920, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/id/puri-garden.html" },
    { id: 28, name: "Four Seasons Sayan", type: "lujo", price: 650, rating: 9.8, reviews: 220, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/id/four-seasons-resort-bali-at-sayan.html" }
  ]
};

export default function HotelWidget({ destination, budgetMode }) {
  const [filter, setFilter] = useState('todos');
  const [expanded, setExpanded] = useState(false);
  
  const destName = destination?.name;
  const hotels = hotelsDB[destName] || [];
  
  const filtered = hotels.filter(h => {
    if (filter === 'todos') return true;
    return h.type === filter;
  });

  const getBudgetLabel = (price) => {
    if (price < 50) return { label: '$', color: '#22c55e', text: 'Mochilero' };
    if (price < 150) return { label: '$$', color: '#EAA000', text: 'Equilibrado' };
    return { label: '$$$', color: '#E8432D', text: 'Lujo' };
  };

  if (!expanded) {
    return (
      <div 
        onClick={() => setExpanded(true)}
        style={{
          background: 'linear-gradient(135deg, rgba(232,67,45,0.1) 0%, rgba(234,160,0,0.05) 100%)',
          border: '1px solid rgba(232,67,45,0.3)',
          borderRadius: 12,
          padding: '14px 18px',
          margin: '0 22px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🏨</span>
          <div>
            <div style={{ fontWeight: 600, color: '#f5f2ed', fontSize: 14 }}>Hoteles verificados</div>
            <div style={{ fontSize: 12, color: '#a89f91' }}>{hotels.length} opciones en {destName}</div>
          </div>
        </div>
        <span style={{ color: '#E8432D', fontSize: 12 }}>Ver →</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(12,8,6,0.8)',
      border: '1px solid rgba(232,67,45,0.3)',
      borderRadius: 16,
      margin: '0 22px 12px',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(245,242,237,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: '#f5f2ed', fontSize: 16 }}>🏨 Hoteles en {destName}</div>
            <div style={{ fontSize: 12, color: '#a89f91', marginTop: 2 }}>Seleccionados y verificados por noma.</div>
          </div>
          <button 
            onClick={() => setExpanded(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#a89f91', 
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1
            }}
          >×</button>
        </div>
        
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['todos', 'hostal', 'boutique', 'lujo'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                background: filter === f ? '#E8432D' : 'rgba(245,242,237,0.1)',
                color: filter === f ? '#fff' : '#a89f91'
              }}
            >
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: 400, overflowY: 'auto', padding: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#a89f91' }}>
            No hay hoteles en esta categoría
          </div>
        ) : (
          filtered.map(hotel => {
            const budget = getBudgetLabel(hotel.price);
            return (
              <div key={hotel.id} style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                background: 'rgba(245,242,237,0.03)',
                borderRadius: 12,
                marginBottom: 10
              }}>
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f5f2ed', fontSize: 14 }}>{hotel.name}</div>
                      <div style={{ fontSize: 12, color: '#a89f91', marginTop: 2, textTransform: 'capitalize' }}>{hotel.type}</div>
                    </div>
                    <div style={{ 
                      background: budget.color + '20', 
                      color: budget.color,
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      {budget.label}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span style={{ color: '#EAA000', fontSize: 13 }}>★ {hotel.rating}</span>
                    <span style={{ color: '#6b6b6b', fontSize: 12 }}>({hotel.reviews} reseñas)</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: 8 
                  }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#f5f2ed' }}>${hotel.price}</span>
                      <span style={{ fontSize: 12, color: '#a89f91' }}>/noche</span>
                    </div>
                    <a 
                      href={hotel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#E8432D',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Ver disponibilidad →
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
