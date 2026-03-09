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
,
  "Ciudad de México": [
    { id: 101, name: "Condesa DF", type: "boutique", price: 180, rating: 9.3, reviews: 1240, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/mx/condesa-df.html" },
    { id: 102, name: "Hostel Home", type: "hostal", price: 22, rating: 9.1, reviews: 2100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/mx/hostel-home-mexico.html" },
    { id: 103, name: "Four Seasons CDMX", type: "lujo", price: 420, rating: 9.6, reviews: 890, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/mx/four-seasons-mexico-city.html" }
  ],
  "Río de Janeiro": [
    { id: 104, name: "Santa Teresa Hotel", type: "boutique", price: 160, rating: 9.2, reviews: 780, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/br/santa-teresa.html" },
    { id: 105, name: "El Misti Hostel", type: "hostal", price: 20, rating: 8.9, reviews: 3200, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/br/el-misti-hostel-rio.html" },
    { id: 106, name: "Belmond Copacabana Palace", type: "lujo", price: 580, rating: 9.7, reviews: 420, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/br/copacabana-palace.html" }
  ],
  "Machu Picchu": [
    { id: 107, name: "Inkaterra Machu Picchu", type: "boutique", price: 220, rating: 9.5, reviews: 540, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/pe/inkaterra-machu-picchu-pueblo.html" },
    { id: 108, name: "Hostal Pirwa Machupicchu", type: "hostal", price: 28, rating: 8.7, reviews: 890, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/pe/pirwa-machupicchu.html" },
    { id: 109, name: "Sumaq Machu Picchu", type: "lujo", price: 480, rating: 9.6, reviews: 310, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/pe/sumaq-machu-picchu.html" }
  ],
  "Bogotá": [
    { id: 110, name: "Casa Legado", type: "boutique", price: 95, rating: 9.4, reviews: 620, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/co/casa-legado.html" },
    { id: 111, name: "Selina Bogotá", type: "hostal", price: 18, rating: 8.8, reviews: 1400, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/co/selina-bogota.html" },
    { id: 112, name: "W Bogotá", type: "lujo", price: 280, rating: 9.3, reviews: 760, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/co/w-bogota.html" }
  ],
  "León": [
    { id: 113, name: "Hotel El Convento", type: "boutique", price: 65, rating: 9.1, reviews: 380, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ni/el-convento.html" },
    { id: 114, name: "Tortuga Booluda Hostel", type: "hostal", price: 12, rating: 8.8, reviews: 720, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ni/tortuga-booluda.html" }
  ],
  "Sucre": [
    { id: 115, name: "Casa Verde Hostel", type: "boutique", price: 40, rating: 9.2, reviews: 290, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/bo/casa-verde-sucre.html" },
    { id: 116, name: "Hostal Cultura", type: "hostal", price: 14, rating: 8.9, reviews: 540, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/bo/cultura.html" },
    { id: 117, name: "Hotel La Posada", type: "lujo", price: 90, rating: 9.0, reviews: 410, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/bo/la-posada-sucre.html" }
  ],
  "Valparaíso": [
    { id: 118, name: "Casa Higueras", type: "boutique", price: 120, rating: 9.3, reviews: 560, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/cl/casa-higueras.html" },
    { id: 119, name: "Hostal Caracol", type: "hostal", price: 22, rating: 8.7, reviews: 890, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/cl/caracol.html" },
    { id: 120, name: "Hotel Fauna", type: "lujo", price: 180, rating: 9.1, reviews: 340, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/cl/fauna-valparaiso.html" }
  ],
  "París": [
    { id: 121, name: "Hôtel du Temps", type: "boutique", price: 190, rating: 9.1, reviews: 1800, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/fr/du-temps.html" },
    { id: 122, name: "Generator Paris", type: "hostal", price: 38, rating: 8.6, reviews: 4200, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/fr/generator-paris.html" },
    { id: 123, name: "Le Meurice", type: "lujo", price: 980, rating: 9.8, reviews: 620, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/fr/le-meurice.html" }
  ],
  "Roma": [
    { id: 124, name: "The Hoxton Roma", type: "boutique", price: 170, rating: 9.2, reviews: 1560, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/it/the-hoxton-rome.html" },
    { id: 125, name: "Yellow Square Hostel", type: "hostal", price: 32, rating: 9.0, reviews: 5100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/it/the-yellow.html" },
    { id: 126, name: "Hotel Eden Roma", type: "lujo", price: 750, rating: 9.7, reviews: 480, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/it/edenroma.html" }
  ],
  "Barcelona": [
    { id: 127, name: "Cotton House Hotel", type: "boutique", price: 220, rating: 9.3, reviews: 1340, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/es/cotton-house.html" },
    { id: 128, name: "Hostel One Paralelo", type: "hostal", price: 28, rating: 9.2, reviews: 3800, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/es/hostelone-paralelo.html" },
    { id: 129, name: "Mandarin Oriental Barcelona", type: "lujo", price: 680, rating: 9.6, reviews: 520, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/es/mandarin-oriental-barcelona.html" }
  ],
  "Ámsterdam": [
    { id: 130, name: "The Dylan Amsterdam", type: "boutique", price: 280, rating: 9.2, reviews: 980, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/nl/the-dylan.html" },
    { id: 131, name: "Stayokay Vondelpark", type: "hostal", price: 42, rating: 8.8, reviews: 4600, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/nl/stayokay-amsterdam-vondelpark.html" },
    { id: 132, name: "Waldorf Astoria Amsterdam", type: "lujo", price: 820, rating: 9.7, reviews: 390, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/nl/waldorf-astoria-amsterdam.html" }
  ],
  "Estambul": [
    { id: 133, name: "Georges Hotel Galata", type: "boutique", price: 130, rating: 9.1, reviews: 1200, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/tr/georges-hotel-galata.html" },
    { id: 134, name: "Cheers Hostel", type: "hostal", price: 18, rating: 8.9, reviews: 2800, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/tr/cheers-hostel.html" },
    { id: 135, name: "Four Seasons Sultanahmet", type: "lujo", price: 520, rating: 9.6, reviews: 640, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/tr/four-seasons-istanbul-sultanahmet.html" }
  ],
  "Tiflis": [
    { id: 136, name: "Fabrika Hostel & Suites", type: "boutique", price: 55, rating: 9.3, reviews: 740, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ge/fabrika.html" },
    { id: 137, name: "Envoy Hostel", type: "hostal", price: 14, rating: 9.1, reviews: 1600, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ge/envoy-hostel.html" },
    { id: 138, name: "Rooms Hotel Tbilisi", type: "lujo", price: 180, rating: 9.4, reviews: 860, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/ge/rooms-hotel-tbilisi.html" }
  ],
  "Sarajevo": [
    { id: 139, name: "Hotel Astra Garni", type: "boutique", price: 70, rating: 9.0, reviews: 480, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ba/astra-garni.html" },
    { id: 140, name: "Hostel Balkan Han", type: "hostal", price: 16, rating: 8.8, reviews: 920, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ba/balkan-han.html" },
    { id: 141, name: "Hotel Europe Sarajevo", type: "lujo", price: 150, rating: 9.2, reviews: 560, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/ba/europe-sarajevo.html" }
  ],
  "Cracovia": [
    { id: 142, name: "Hotel Stary", type: "boutique", price: 160, rating: 9.4, reviews: 1100, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/pl/stary.html" },
    { id: 143, name: "Greg & Tom Beer House Hostel", type: "hostal", price: 14, rating: 9.0, reviews: 3400, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/pl/greg-tom-beer-house.html" },
    { id: 144, name: "Hotel Copernicus", type: "lujo", price: 280, rating: 9.5, reviews: 620, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/pl/copernicus.html" }
  ],
  "Bangkok": [
    { id: 145, name: "Ariyasom Villa", type: "boutique", price: 140, rating: 9.3, reviews: 680, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/th/ariyasom-villa.html" },
    { id: 146, name: "Lub d Bangkok Silom", type: "hostal", price: 18, rating: 8.9, reviews: 4200, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/th/lubd-silom.html" },
    { id: 147, name: "Capella Bangkok", type: "lujo", price: 520, rating: 9.8, reviews: 290, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/th/capella-bangkok.html" }
  ],
  "Seúl": [
    { id: 148, name: "Ryse Autograph Collection", type: "boutique", price: 170, rating: 9.2, reviews: 940, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/kr/ryse.html" },
    { id: 149, name: "Kim's Guesthouse Insadong", type: "hostal", price: 22, rating: 8.8, reviews: 2600, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/kr/kims-guesthouse-insadong.html" },
    { id: 150, name: "Park Hyatt Seoul", type: "lujo", price: 440, rating: 9.5, reviews: 580, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/kr/park-hyatt-seoul.html" }
  ],
  "Hanói": [
    { id: 151, name: "La Siesta Classic Ma May", type: "boutique", price: 55, rating: 9.2, reviews: 1200, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/vn/la-siesta-classic-ma-may.html" },
    { id: 152, name: "Hanoi Backpackers Hostel", type: "hostal", price: 10, rating: 8.7, reviews: 3800, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/vn/hanoi-backpackers-hostel.html" },
    { id: 153, name: "Sofitel Legend Metropole", type: "lujo", price: 320, rating: 9.6, reviews: 840, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/vn/sofitel-legend-metropole-hanoi.html" }
  ],
  "Chiang Mai": [
    { id: 154, name: "137 Pillars House", type: "boutique", price: 180, rating: 9.5, reviews: 520, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/th/137pillarshouse.html" },
    { id: 155, name: "Deejai Backpackers", type: "hostal", price: 9, rating: 9.1, reviews: 2900, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/th/deejai-backpackers.html" },
    { id: 156, name: "Rosewood Chiang Mai", type: "lujo", price: 480, rating: 9.7, reviews: 180, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/th/rosewood-chiang-mai.html" }
  ],
  "Katmandú": [
    { id: 157, name: "Kantipur Temple House", type: "boutique", price: 60, rating: 9.1, reviews: 480, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/np/kantipur-temple-house.html" },
    { id: 158, name: "Alobar1000 Hostel", type: "hostal", price: 10, rating: 9.3, reviews: 2100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/np/alobar1000.html" },
    { id: 159, name: "Dwarika's Hotel", type: "lujo", price: 280, rating: 9.6, reviews: 360, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/np/dwarika-s.html" }
  ],
  "Luang Prabang": [
    { id: 160, name: "Maison Souvannaphoum", type: "boutique", price: 110, rating: 9.3, reviews: 420, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/la/maison-souvannaphoum.html" },
    { id: 161, name: "Spicy Lao Backpackers", type: "hostal", price: 8, rating: 8.9, reviews: 1100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/la/spicy-lao-backpackers.html" },
    { id: 162, name: "Amantaka", type: "lujo", price: 680, rating: 9.8, reviews: 190, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/la/amantaka.html" }
  ],
  "Marrakech": [
    { id: 163, name: "Riad Yasmine", type: "boutique", price: 90, rating: 9.2, reviews: 1400, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ma/riad-yasmine.html" },
    { id: 164, name: "Equity Point Marrakech", type: "hostal", price: 16, rating: 8.8, reviews: 2600, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ma/equity-point-marrakech.html" },
    { id: 165, name: "La Mamounia", type: "lujo", price: 650, rating: 9.7, reviews: 780, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/ma/la-mamounia.html" }
  ],
  "Zanzibar": [
    { id: 166, name: "Emerson Spice Hotel", type: "boutique", price: 140, rating: 9.4, reviews: 380, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/tz/emerson-spice.html" },
    { id: 167, name: "Karibu Inn", type: "hostal", price: 22, rating: 8.9, reviews: 760, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/tz/karibu-inn.html" },
    { id: 168, name: "The Residence Zanzibar", type: "lujo", price: 480, rating: 9.7, reviews: 240, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/tz/the-residence-zanzibar.html" }
  ],
  "Essaouira": [
    { id: 169, name: "Riad Mimouna", type: "boutique", price: 75, rating: 9.1, reviews: 320, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ma/riad-mimouna-essaouira.html" },
    { id: 170, name: "Hostel Medina Essaouira", type: "hostal", price: 14, rating: 8.7, reviews: 580, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ma/hostel-medina-essaouira.html" },
    { id: 171, name: "Hotel Heure Bleue", type: "lujo", price: 190, rating: 9.3, reviews: 440, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/ma/heure-bleue.html" }
  ],
  "Ciudad del Cabo": [
    { id: 172, name: "The Gorgeous George", type: "boutique", price: 160, rating: 9.2, reviews: 680, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/za/the-gorgeous-george.html" },
    { id: 173, name: "Once in Cape Town", type: "hostal", price: 22, rating: 9.0, reviews: 1800, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/za/once-in-cape-town.html" },
    { id: 174, name: "Twelve Apostles Hotel", type: "lujo", price: 480, rating: 9.6, reviews: 520, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/za/twelve-apostles.html" }
  ],
  "Dubái": [
    { id: 175, name: "XVA Art Hotel", type: "boutique", price: 130, rating: 9.0, reviews: 540, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/ae/xva-art-hotel.html" },
    { id: 176, name: "Zabeel House Mini", type: "hostal", price: 55, rating: 8.8, reviews: 1200, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/ae/zabeel-house-mini.html" },
    { id: 177, name: "Burj Al Arab", type: "lujo", price: 1800, rating: 9.8, reviews: 420, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/ae/burj-al-arab.html" }
  ],
  "Petra": [
    { id: 178, name: "Mövenpick Resort Petra", type: "boutique", price: 150, rating: 9.1, reviews: 820, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/jo/movenpick-resort-petra.html" },
    { id: 179, name: "Valentine Inn", type: "hostal", price: 18, rating: 8.9, reviews: 1100, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/jo/valentine-inn.html" },
    { id: 180, name: "Petra Marriott Hotel", type: "lujo", price: 280, rating: 9.3, reviews: 560, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/jo/petra-marriott.html" }
  ],
  "Omán": [
    { id: 181, name: "Alila Jabal Akhdar", type: "boutique", price: 280, rating: 9.5, reviews: 340, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", link: "https://www.booking.com/hotel/om/alila-jabal-akhdar.html" },
    { id: 182, name: "Muscat Youth Hostel", type: "hostal", price: 20, rating: 8.5, reviews: 420, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", link: "https://www.booking.com/hotel/om/muscat-youth-hostel.html" },
    { id: 183, name: "The Chedi Muscat", type: "lujo", price: 420, rating: 9.7, reviews: 280, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", link: "https://www.booking.com/hotel/om/the-chedi-muscat.html" }
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
