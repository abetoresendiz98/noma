import FlightSearch from "./FlightSearch.jsx"
import MapWeather from "./MapWeather.jsx"
import HotelWidget from "./HotelWidget.jsx"
import SavedTrips from "./SavedTrips.jsx"
import React from "react"
import { useState, useEffect, useRef, useCallback } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DESTINATIONS = [
  { id:1, name:"Cartagena", country:"Colombia", region:"Latinoamérica", emoji:"🇨🇴",
    price:{mochilero:280,equilibrado:520,premium:1400}, rating:4.9, reviews:2847,
    verified:"hace 2 días", verifiedBy:34, tag:"🔥 Tendencia",
    img:"https://images.unsplash.com/photo-1583997052301-d9c02640c386?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&q=85",
    vibe:"Playa + Cultura", duration:"4-6 días", safe:87, climate:"28°C · Tropical",
    best_months:"Dic–Abr", lang:"Español", currency:"COP ($)",
    gems:["Playa Blanca: toma la lancha local ($3) no el tour ($25) — misma playa, 90% menos turistas","Bazurto Market al amanecer: el mercado que los guías evitan mostrar. Desayuno por $2, experiencia de vida","Getsemaní de noche: el barrio real de Cartagena. Los grafitis y la cumbia auténtica que no salen en Instagram"],
    warnings:["Evita taxis sin taxímetro — negocia precio antes","Las playas frente al hotel son privadas de facto — camina 10 min al este","Alta temporada Dic-Ene: precios +40%"],
    hidden_score:94, local_tips:["La paleta de coco en la playa cuesta $0.50 con los vendedores locales, no $3 en el resort","El bus al centro desde el aeropuerto: $0.80. El taxi oficial: $12. Exactamente la misma ruta"] },

  { id:2, name:"Lisboa", country:"Portugal", region:"Europa", emoji:"🇵🇹",
    price:{mochilero:420,equilibrado:780,premium:2200}, rating:4.8, reviews:3412,
    verified:"hace 1 día", verifiedBy:67, tag:"✈️ Vuelos baratos",
    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=85",
    vibe:"Ciudad + Historia", duration:"3-5 días", safe:94, climate:"22°C · Mediterráneo",
    best_months:"Mar–Jun · Sep–Oct", lang:"Portugués", currency:"EUR (€)",
    gems:["Tasca do Chico: fado auténtico sin cover, sin turistas. Reserva martes–jueves. Llega antes de las 8pm","LX Factory domingos: el mercado que la guía Lonely Planet aún no descubrió masivamente. Vinilo, arte, pastéis","Eléctrico 28 completo de punta a punta: el tour más barato de Lisboa (€3) sin guía ni reserva"],
    warnings:["Alfama en verano: +35°C y lleno. Ve en mayo o septiembre","Uber es 30% más barato que taxi en la ciudad","Cuidado con bolsos en Rossio — zona de carteristas conocida"],
    hidden_score:89, local_tips:["Pastel de nata: en la Fábrica de Pastéis de Belém €1.20, en cualquier turístico €3.50. El original no tiene sucursal","A Cevicheria en Príncipe Real: reserva con 3 semanas, vale cada euro. El mejor pulpo del mundo"] },

  { id:3, name:"Cusco", country:"Perú", region:"Latinoamérica", emoji:"🇵🇪",
    price:{mochilero:220,equilibrado:450,premium:1800}, rating:4.9, reviews:1923,
    verified:"hace 3 días", verifiedBy:28, tag:"🏔️ Aventura épica",
    img:"https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=1400&q=85",
    vibe:"Historia + Naturaleza", duration:"5-7 días", safe:82, climate:"15°C · Andino",
    best_months:"May–Sep", lang:"Español / Quechua", currency:"PEN (S/)",
    gems:["Salkantay Trek vs. Inca Trail: igual de épico, $180 más barato, 70% menos gente. La decisión obvia","Chinchero mercado martes y jueves: artesanía a precio local S/15 vs S/80 en el centro de Cusco","Pachapapa en San Blas: cocina novoandina auténtica a $12 por persona. Los limeños lo guardan como secreto"],
    warnings:["Mal de altura real: tómate 2 días de aclimatación antes de hacer caminatas","Compra las entradas del Boleto Turístico con anticipación — se agotan en temporada alta","El tren a Aguas Calientes: reserva con 30+ días en temporada alta"],
    hidden_score:91, local_tips:["Hoja de coca para el soroche: te la dan gratis en el hotel o compras en mercado por S/1. Funciona de verdad","El desayuno incluido en los hostales suele ser mejor que cualquier cafetería turística"] },

  { id:4, name:"Oaxaca", country:"México", region:"Latinoamérica", emoji:"🇲🇽",
    price:{mochilero:180,equilibrado:360,premium:900}, rating:4.9, reviews:1456,
    verified:"hace 2 días", verifiedBy:19, tag:"💎 Joya oculta",
    img:"https://images.unsplash.com/photo-1547558902-c0e053edd9e9?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1400&q=85",
    vibe:"Gastronomía + Arte", duration:"4-6 días", safe:88, climate:"24°C · Templado",
    best_months:"Oct–Abr", lang:"Español / Zapoteca", currency:"MXN ($)",
    gems:["Palenques de mezcal locales: $1.50 el mezcal artesanal vs $8 en bares del Zócalo. Pide que te expliquen el proceso","Hierve el Agua: cascadas petrificadas a 70km. El 90% de turistas no llega — ve en colectivo ($2) no en tour ($40)","Mercado 20 de Noviembre: el mole negro más auténtico del mundo. $4 el plato completo con todo"],
    warnings:["Día de Muertos (oct-nov): los precios se duplican y se agota todo — reserva con meses de anticipación","El calor en mayo-junio es intenso. Lleva protector solar factor 70+","Carros en el centro: ve a pie, todo está a máximo 20 minutos caminando"],
    hidden_score:96, local_tips:["La tlayuda con tasajo en el mercado: $3. En restaurante con turistas: $18. Exactamente el mismo plato","Casa de la Abuela en el mercado Benito Juárez: el mejor chocolate caliente de Oaxaca, $1.50"] },

  { id:5, name:"Plovdiv", country:"Bulgaria", region:"Europa", emoji:"🇧🇬",
    price:{mochilero:160,equilibrado:300,premium:750}, rating:4.7, reviews:892,
    verified:"hace 4 días", verifiedBy:11, tag:"🔍 Casi desconocido",
    img:"https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&q=85",
    vibe:"Historia + Cultura bohemia", duration:"3-4 días", safe:92, climate:"20°C · Continental",
    best_months:"May–Jun · Sep", lang:"Búlgaro", currency:"BGN (лв)",
    gems:["La ciudad habitada más antigua de Europa — 6000 años. Casi nadie lo sabe. El Coliseo romano en el centro de la ciudad, sin cola, sin entrada","Kapana creative district: el barrio de artistas donde un café cuesta €1 y las galerías son gratis","Vuelos desde Madrid a €40 ida y vuelta si reservas 6 semanas antes en Ryanair o Wizz Air"],
    warnings:["El cirílico complica la navegación — descarga Google Translate con modo cámara offline","Transporte público limitado — muchos sitios solo a pie o taxi","Poca oferta gastronómica internacional — pero la cocina local es extraordinaria y baratísima"],
    hidden_score:99, local_tips:["Mecha en el barrio Kapana: el restaurante donde comen los locales. Menú del día €4, incluye sopa + plato + bebida","El Amphitheatre romano en el centro: entrada gratuita si llegas a las 8am antes que los guías"] },

  { id:6, name:"Medellín", country:"Colombia", region:"Latinoamérica", emoji:"🇨🇴",
    price:{mochilero:210,equilibrado:400,premium:1100}, rating:4.7, reviews:2156,
    verified:"hace 4 días", verifiedBy:41, tag:"🌟 Transformación épica",
    img:"https://images.unsplash.com/photo-1599413520757-8dc5c0e93c46?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&q=85",
    vibe:"Ciudad + Innovación", duration:"4-6 días", safe:79, climate:"22°C · Primavera eterna",
    best_months:"Todo el año", lang:"Español", currency:"COP ($)",
    gems:["Metro + Metrocable línea K: el mirador más impresionante de la ciudad por $1. Sube a Santo Domingo y come en los puestos locales","Parque Arví: 1000 hectáreas de naturaleza a 20 minutos del centro. Los paisas van los domingos — únete a ellos","El Poblado vs. Laureles: El Poblado para turistas, Laureles para vivir como local (30% más barato y más auténtico)"],
    warnings:["La ciudad es segura en zonas turísticas — Laureles, El Poblado, Envigado. No aventurarse de noche a zonas desconocidas sin local","El tráfico es denso. Usa el metro siempre que puedas","La lluvia: llega sin avisar en las tardes. Siempre carga paraguas pequeño"],
    hidden_score:87, local_tips:["Bandeja paisa completa en el Mercado del Río: $5. En restaurante del Poblado: $18. La diferencia es el ambiente, no la comida","El tranvía de Ayacucho conecta el metro con las comunas. $0.80 y una experiencia de ciudad real"] },

  { id:7, name:"Tokio", country:"Japón", region:"Asia", emoji:"🇯🇵",
    price:{mochilero:680,equilibrado:1100,premium:3500}, rating:5.0, reviews:5847,
    verified:"hace 6 horas", verifiedBy:112, tag:"🏯 Nivel dios",
    img:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1400&q=85",
    vibe:"Tecnología + Tradición", duration:"7-10 días", safe:98, climate:"18°C · Variable",
    best_months:"Mar–May · Sep–Nov", lang:"Japonés", currency:"JPY (¥)",
    gems:["Yanaka: el barrio edo que sobrevivió los bombardeos. Cero turistas, gatos en las calles, tiendas de 1950","Depachika (sótanos de supermercados): cena de 5 platos por ¥800 con lo que descarten al cierre. Legal, fresco, delicioso","Tren nocturno Kyoto–Tokio vs Shinkansen: ¥3000 vs ¥14000. Llegas igual, ahorras una noche de hotel. Reserva con 3 semanas"],
    warnings:["JR Pass solo vale la pena si vas Tokio–Kioto–Osaka en menos de 14 días. Calcula antes de comprar","El efectivo es rey en Japón — muchos sitios NO aceptan tarjeta todavía","La barrera del idioma es real. Descarga Google Translate con modo cámara para los menús"],
    hidden_score:86, local_tips:["7-Eleven y FamilyMart tienen comida de restaurante a precio de conveniencia. El onigiri y el ramen de convenience store son mejores de lo que imaginas","Templo Senso-ji a las 6am: el único momento sin turistas. Y los colores del amanecer son imposibles"] },

  { id:8, name:"Fez", country:"Marruecos", region:"África", emoji:"🇲🇦",
    price:{mochilero:150,equilibrado:300,premium:900}, rating:4.8, reviews:1678,
    verified:"hace 3 días", verifiedBy:22, tag:"🕌 Inmersión total",
    img:"https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1539020140153-e479b8b5df57?w=1400&q=85",
    vibe:"Historia + Laberinto", duration:"3-5 días", safe:80, climate:"25°C · Seco",
    best_months:"Mar–May · Sep–Nov", lang:"Árabe / Francés", currency:"MAD (د.م)",
    gems:["Curtiduría Chouara: la vista gratis es desde las tiendas de cuero del piso de arriba — no desde abajo que cobran","Forn al-Cheikh: el horno comunal del siglo XIV. Los residentes traen su masa, tú puedes ver gratis a las 8am","El tren Tánger–Fez: $12, 5 horas, vistas de la cordillera del Rif. Infinitamente mejor que el autobús"],
    warnings:["Los guías no solicitados son inevitables — sé amable pero firme con 'La shukran'","El calor de julio-agosto supera los 42°C en el interior. Primavera u otoño son incomparablemente mejores","Lleva dirhams en efectivo — los cajeros escasean en la medina"],
    hidden_score:93, local_tips:["Mechoui (cordero asado) en el restaurante sin nombre frente a la puerta Bab Bou Jeloud: $6 el plato. Sin menú, sin carta. Solo señalas y comes","El hammam local vs hammam turístico: $2 vs $30. Experiencia idéntica, precio brutal. Pregunta en tu riad"] },

  { id:9, name:"Buenos Aires", country:"Argentina", region:"Latinoamérica", emoji:"🇦🇷",
    price:{mochilero:160,equilibrado:340,premium:1000}, rating:4.8, reviews:2634,
    verified:"hace 5 días", verifiedBy:38, tag:"🥩 Gastronómico",
    img:"https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1400&q=85",
    vibe:"Ciudad + Pasión", duration:"4-7 días", safe:81, climate:"20°C · Variable",
    best_months:"Mar–May · Sep–Nov", lang:"Español rioplatense", currency:"ARS ($)",
    gems:["Don Julio en Palermo: reserva con 3 semanas. $20 la mejor carne de tu vida — y el propietario viene a tu mesa","Milonga La Catedral jueves noche: tango real en un galpón descascarado. $5 entrada, sin turistas, sin show","Feria de San Telmo domingos: obras de arte a $5, antigüedades a precio de mercado de pulgas. Llega a las 9am"],
    warnings:["El tipo de cambio en Argentina cambia constantemente — verifica el blue dólar antes de ir","Palermo Hollywood y Soho: seguros. La Boca: solo en el Caminito y durante el día","Las huelgas de transporte son frecuentes — descarga la app Cabify como backup"],
    hidden_score:88, local_tips:["El asado de los domingos en los parques: si ves a una familia asando y te invitan, acepta siempre. Es la cultura real","El colectivo (autobús) cuesta $0.20. El taxi, $8. El colectivo llega a todos lados igual de rápido"] },

  { id:10, name:"Bali", country:"Indonesia", region:"Asia", emoji:"🇮🇩",
    price:{mochilero:380,equilibrado:720,premium:2800}, rating:4.9, reviews:4201,
    verified:"hace 1 día", verifiedBy:89, tag:"🌺 Espiritual",
    img:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=85",
    cover:"https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1400&q=85",
    vibe:"Playa + Espiritualidad", duration:"7-10 días", safe:85, climate:"30°C · Tropical",
    best_months:"May–Sep", lang:"Balinés / Indonesio", currency:"IDR (Rp)",
    gems:["Canggu vs. Seminyak: misma calidad de playa y comida, 40% más barato y 60% más auténtico. No hay discusión","Moto de alquiler: $5/día y $2 de gasolina para todo el día. La única manera real de ver Bali sin depender de tours","Warung Babi Guling Ibu Oka en Ubud: la lechona balinesa que visitó Obama. $4 el plato. Llega antes de las 11am o se acaba"],
    warnings:["La moto: muchos turistas se lesionan. Si no tienes experiencia, empieza en caminos tranquilos de Ubud","El dengue existe — repelente con DEET obligatorio al amanecer y atardecer","Los templos requieren sarong (lo prestan gratis) — respeta siempre"],
    hidden_score:85, local_tips:["Templo Tirta Gangga a las 6:30am: solo tú y los devotos locales. A las 10am es un caos turístico","Los warung (restaurantes familiares) sin menú en inglés son invariablemente mejores y más baratos que los que sí lo tienen"] },,

  // ══ 🌎 LATAM TURÍSTICOS ══
  { id:101, name:"Ciudad de México", country:"México", region:"Latinoamérica", emoji:"🇲🇽",
    price:{mochilero:280,equilibrado:620,premium:1800}, rating:4.8, reviews:4201,
    verified:"hace 1 día", verifiedBy:78, tag:"🏛️ Imperdible",
    img:"https://images.unsplash.com/photo-1518638150340-f706e86654de?w=900&q=85",
    coords:{lat:19.4326,lon:-99.1332}, vibe:"Historia + Gastronomía", clima:"24°C · Templado",
    bestMonth:"Oct–May", language:"Español", currency:"MXN", safety:79, authentic:88,
    gems:["Xochimilco en trajinera local ($3) no en tour ($30)","Mercado Jamaica al amanecer — flores y desayuno por $2","Coyoacán un martes: sin turistas, con soul"],
    warnings:["Altitud 2240m — primer día sin correr","Uber siempre sobre taxis de calle"] },

  { id:102, name:"Río de Janeiro", country:"Brasil", region:"Latinoamérica", emoji:"🇧🇷",
    price:{mochilero:320,equilibrado:750,premium:2200}, rating:4.8, reviews:3890,
    verified:"hace 2 días", verifiedBy:61, tag:"🌴 Icónico",
    img:"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900&q=85",
    coords:{lat:-22.9068,lon:-43.1729}, vibe:"Playa + Cultura", clima:"28°C · Tropical",
    bestMonth:"Sep–Mar", language:"Portugués", currency:"BRL", safety:68, authentic:82,
    gems:["Santa Teresa: el barrio bohemio que los tours omiten","Mirante Dona Marta: mejores vistas de Río, gratis","Feira de São Cristóvão — cultura nordestina real"],
    warnings:["No caminar solo de noche en zonas no turísticas","Cuidado con pertenencias en playas"] },

  { id:103, name:"Machu Picchu", country:"Perú", region:"Latinoamérica", emoji:"🇵🇪",
    price:{mochilero:420,equilibrado:900,premium:2800}, rating:5.0, reviews:6102,
    verified:"hace 3 días", verifiedBy:44, tag:"🏔️ Maravilla Mundial",
    img:"https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=900&q=85",
    coords:{lat:-13.1631,lon:-72.5450}, vibe:"Historia + Montaña", clima:"15°C · Andino",
    bestMonth:"May–Sep", language:"Español", currency:"PEN", safety:88, authentic:95,
    gems:["Puerta del Sol al amanecer — gratis y sin multitudes","Camino Salkantay: alternativa épica al Inca Trail","Aguas Calientes al alba, antes de los tours masivos"],
    warnings:["Reservar entrada con 2 meses de anticipación","Aclimatarse mínimo 2 días en Cusco antes"] },

  { id:104, name:"Bogotá", country:"Colombia", region:"Latinoamérica", emoji:"🇨🇴",
    price:{mochilero:240,equilibrado:560,premium:1600}, rating:4.6, reviews:2134,
    verified:"hace 2 días", verifiedBy:39, tag:"🎨 Arte & Café",
    img:"https://images.unsplash.com/photo-1597659840990-5f84abe8ef7b?w=900&q=85",
    coords:{lat:4.7110,lon:-74.0721}, vibe:"Ciudad + Cultura", clima:"14°C · Fresco",
    bestMonth:"Dic–Mar", language:"Español", currency:"COP", safety:72, authentic:84,
    gems:["Monserrate al amanecer: la ciudad a tus pies gratis","La Candelaria a pie — historia sin guía","Mercado de las Pulgas: antigüedades y historias por $1"],
    warnings:["Solo Uber o InDrive de noche","No saques el teléfono caminando en zonas concurridas"] },

  // ══ 💎 LATAM JOYAS BARATAS ══
  { id:105, name:"León", country:"Nicaragua", region:"Latinoamérica", emoji:"🇳🇮",
    price:{mochilero:130,equilibrado:280,premium:800}, rating:4.6, reviews:892,
    verified:"hace 4 días", verifiedBy:14, tag:"💎 $18/día todo incluido",
    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
    coords:{lat:12.4379,lon:-86.8782}, vibe:"Historia + Volcanes", clima:"32°C · Caluroso",
    bestMonth:"Nov–Abr", language:"Español", currency:"NIO", safety:80, authentic:96,
    gems:["Sandboarding volcán Cerro Negro ($10 todo incluido)","Catedral más grande de Centroamérica — entrada gratis","Las Peñitas: playa virgen sin un hotel de cadena"],
    warnings:["Calor extremo mayo–octubre","Verificar situación política antes de reservar"] },

  { id:106, name:"Sucre", country:"Bolivia", region:"Latinoamérica", emoji:"🇧🇴",
    price:{mochilero:150,equilibrado:320,premium:900}, rating:4.7, reviews:1043,
    verified:"hace 3 días", verifiedBy:17, tag:"💎 Ciudad Blanca",
    img:"https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=900&q=85",
    coords:{lat:-19.0196,lon:-65.2619}, vibe:"Historia + Cultura", clima:"18°C · Templado",
    bestMonth:"May–Oct", language:"Español", currency:"BOB", safety:84, authentic:94,
    gems:["Mercado Central: desayuno boliviano completo por $1.50","Cal Orck'o: huellas reales de dinosaurios en roca","Tarabuco: mercado indígena auténtico cada domingo"],
    warnings:["Altitud 2750m — hidratarse mucho el primer día","Salar de Uyuni a 3h — no te lo pierdas"] },

  { id:107, name:"Valparaíso", country:"Chile", region:"Latinoamérica", emoji:"🇨🇱",
    price:{mochilero:220,equilibrado:480,premium:1400}, rating:4.7, reviews:1567,
    verified:"hace 2 días", verifiedBy:28, tag:"💎 Arte urbano épico",
    img:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=900&q=85",
    coords:{lat:-33.0472,lon:-71.6127}, vibe:"Ciudad + Arte", clima:"17°C · Mediterráneo",
    bestMonth:"Nov–Mar", language:"Español", currency:"CLP", safety:76, authentic:90,
    gems:["Cerros Alegre y Concepción a pie — el museo al aire libre más grande de Chile","Mercado Puerto al mediodía: mariscos frescos por $5","Viña del Mar a 15 min en metro local ($0.80)"],
    warnings:["Zona portuaria baja no recomendable de noche"] },

  // ══ 🇪🇺 EUROPA TURÍSTICOS ══
  { id:108, name:"París", country:"Francia", region:"Europa", emoji:"🇫🇷",
    price:{mochilero:560,equilibrado:1200,premium:3500}, rating:4.8, reviews:8923,
    verified:"hace 1 día", verifiedBy:134, tag:"🗼 Imperdible",
    img:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85",
    coords:{lat:48.8566,lon:2.3522}, vibe:"Arte + Gastronomía", clima:"15°C · Variable",
    bestMonth:"Abr–Jun", language:"Francés", currency:"EUR", safety:82, authentic:74,
    gems:["Montmartre a las 7am: la ciudad duerme, tú la tienes","Marché d'Aligre: mercado local real, no Monmartre turístico","Coulée Verte: parque elevado secreto, sin turistas"],
    warnings:["Los meseros no traen la cuenta — pídela siempre","Carteristas en metro línea 1 y zona Torre Eiffel"] },

  { id:109, name:"Roma", country:"Italia", region:"Europa", emoji:"🇮🇹",
    price:{mochilero:480,equilibrado:1050,premium:3000}, rating:4.9, reviews:7654,
    verified:"hace 1 día", verifiedBy:98, tag:"🏛️ Ciudad Eterna",
    img:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=85",
    coords:{lat:41.9028,lon:12.4964}, vibe:"Historia + Gastronomía", clima:"18°C · Mediterráneo",
    bestMonth:"Abr–Jun", language:"Italiano", currency:"EUR", safety:83, authentic:79,
    gems:["Gianicolo al atardecer: vistas de Roma gratis y sin nadie","Trastevere de noche: la Roma auténtica que no sale en fotos","Mercado Testaccio: comida local real, no restaurantes de la Piazza"],
    warnings:["El agua de todas las fuentes es potable y gratis","Julio–Agosto: calor extremo y masificación total"] },

  { id:110, name:"Barcelona", country:"España", region:"Europa", emoji:"🇪🇸",
    price:{mochilero:480,equilibrado:1050,premium:3200}, rating:4.8, reviews:6789,
    verified:"hace 2 días", verifiedBy:87, tag:"🏖️ Mar + Arquitectura",
    img:"https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=85",
    coords:{lat:41.3851,lon:2.1734}, vibe:"Playa + Cultura", clima:"20°C · Mediterráneo",
    bestMonth:"May–Jun", language:"Español/Catalán", currency:"EUR", safety:80, authentic:76,
    gems:["Bunkers del Carmel al sunset: la mejor vista de BCN, gratis","Mercado Santa Caterina: sin turistas, con cooks locales","Poblenou: el barrio bohemio que Gracia era hace 15 años"],
    warnings:["Carteristas profesionales en Las Ramblas y metro L3","Julio–Agosto: precios se duplican y playas colapsan"] },

  { id:111, name:"Ámsterdam", country:"Países Bajos", region:"Europa", emoji:"🇳🇱",
    price:{mochilero:600,equilibrado:1280,premium:3800}, rating:4.7, reviews:5432,
    verified:"hace 1 día", verifiedBy:76, tag:"🚲 Canales",
    img:"https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=900&q=85",
    coords:{lat:52.3676,lon:4.9041}, vibe:"Ciudad + Arte", clima:"12°C · Lluvioso",
    bestMonth:"Abr–May", language:"Holandés/Inglés", currency:"EUR", safety:88, authentic:72,
    gems:["Jordaan de mañana en bici: canales sin turistas","Mercado Albert Cuyp: el más grande de Holanda, muy local","NDSM Wharf: arte urbano industrial, entrada gratis"],
    warnings:["Las bicicletas tienen prioridad absoluta — no camines en el carril bici","Tulipanes solo en abril–mayo (Keukenhof)"] },

  { id:112, name:"Estambul", country:"Turquía", region:"Europa", emoji:"🇹🇷",
    price:{mochilero:280,equilibrado:650,premium:2000}, rating:4.9, reviews:5876,
    verified:"hace 1 día", verifiedBy:92, tag:"🕌 Dos continentes",
    img:"https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=85",
    coords:{lat:41.0082,lon:28.9784}, vibe:"Historia + Bazar", clima:"16°C · Variable",
    bestMonth:"Abr–Jun", language:"Turco", currency:"TRY", safety:78, authentic:91,
    gems:["Balat y Karaköy: los barrios reales, no el Gran Bazar","Ferry local al lado asiático ($0.50): el mejor panorama de Estambul","Desayuno turco épico en Beşiktaş por $4"],
    warnings:["Inflación muy alta — los precios cambian cada semana","Negociar en bazares es obligatorio, no opcional"] },

  // ══ 💎 EUROPA JOYAS BARATAS ══
  { id:113, name:"Tiflis", country:"Georgia", region:"Europa", emoji:"🇬🇪",
    price:{mochilero:175,equilibrado:390,premium:1100}, rating:4.8, reviews:2134,
    verified:"hace 3 días", verifiedBy:31, tag:"💎 Europa más barata",
    img:"https://images.unsplash.com/photo-1565008576549-57569a49371d?w=900&q=85",
    coords:{lat:41.6938,lon:44.8015}, vibe:"Historia + Vino", clima:"14°C · Variable",
    bestMonth:"May–Jun", language:"Georgiano", currency:"GEL", safety:91, authentic:95,
    gems:["Baños sulfurosos del barrio Abanotubani ($5 sesión completa)","Kakheti — región vinícola más antigua del mundo ($30/día)","Uplistsikhe: ciudad cueva del siglo VI, a 1h de Tiflis"],
    warnings:["Conducción muy agresiva — cruza con cuidado","Pocas señales en inglés fuera del centro"] },

  { id:114, name:"Sarajevo", country:"Bosnia", region:"Europa", emoji:"🇧🇦",
    price:{mochilero:175,equilibrado:380,premium:1050}, rating:4.7, reviews:1432,
    verified:"hace 4 días", verifiedBy:19, tag:"💎 Historia impactante",
    img:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=85",
    coords:{lat:43.8563,lon:18.4131}, vibe:"Historia + Gastronomía", clima:"13°C · Variable",
    bestMonth:"May–Sep", language:"Bosnio", currency:"BAM", safety:90, authentic:96,
    gems:["Baščaršija: el bazar otomano más auténtico de Europa","Túnel de la Esperanza: historia reciente que te cambia","Mostar y su Stari Most a solo 1h en bus ($5)"],
    warnings:["Zonas rurales apartadas aún tienen minas","Poco inglés fuera del centro turístico"] },

  { id:115, name:"Cracovia", country:"Polonia", region:"Europa", emoji:"🇵🇱",
    price:{mochilero:220,equilibrado:500,premium:1400}, rating:4.8, reviews:3201,
    verified:"hace 2 días", verifiedBy:47, tag:"💎 Medieval a mitad de precio",
    img:"https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=900&q=85",
    coords:{lat:50.0647,lon:19.9450}, vibe:"Historia + Noche", clima:"9°C · Continental",
    bestMonth:"May–Sep", language:"Polaco", currency:"PLN", safety:92, authentic:87,
    gems:["Kazimierz de noche: el barrio judío más bohemio de Europa del Este","Minas de sal de Wieliczka ($15 — vale cada centavo)","Plaza Rynek Główny: la más grande de Europa medieval, gratis"],
    warnings:["Invierno muy frío, hasta -15°C","Auschwitz requiere reserva con semanas de anticipación"] },

  // ══ 🌏 ASIA TURÍSTICOS ══
  { id:116, name:"Bangkok", country:"Tailandia", region:"Asia", emoji:"🇹🇭",
    price:{mochilero:175,equilibrado:450,premium:1400}, rating:4.8, reviews:7234,
    verified:"hace 1 día", verifiedBy:103, tag:"🛺 Street Food",
    img:"https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&q=85",
    coords:{lat:13.7563,lon:100.5018}, vibe:"Templos + Gastronomía", clima:"33°C · Húmedo",
    bestMonth:"Nov–Feb", language:"Tailandés", currency:"THB", safety:81, authentic:83,
    gems:["Wat Arun al amanecer: el templo de mármol sin nadie","Mercado flotante Amphawa los fines de semana ($2 bote)","Chinatown de noche: cena épica por $3"],
    warnings:["Calor extremo de marzo a mayo","Precio fijo con tuk-tuks antes de subir siempre"] },

  { id:117, name:"Seúl", country:"Corea del Sur", region:"Asia", emoji:"🇰🇷",
    price:{mochilero:320,equilibrado:750,premium:2200}, rating:4.8, reviews:5678,
    verified:"hace 1 día", verifiedBy:84, tag:"🎮 K-Culture",
    img:"https://images.unsplash.com/photo-1538485399081-7191377e8241?w=900&q=85",
    coords:{lat:37.5665,lon:126.9780}, vibe:"Modernidad + Tradición", clima:"14°C · Variable",
    bestMonth:"Abr–Jun", language:"Coreano", currency:"KRW", safety:94, authentic:85,
    gems:["Bukchon Hanok Village a las 6am: solo tú y el silencio","Mercado Gwangjang: comida callejera real por $2","Hongdae de noche: energía K-pop gratis toda la noche"],
    warnings:["Cherry blossom = multitudes extremas y precios altos","Calor húmedo insoportable en julio–agosto"] },

  // ══ 💎 ASIA JOYAS BARATAS ══
  { id:118, name:"Hanói", country:"Vietnam", region:"Asia", emoji:"🇻🇳",
    price:{mochilero:140,equilibrado:320,premium:950}, rating:4.7, reviews:3456,
    verified:"hace 2 días", verifiedBy:52, tag:"💎 Pho a $1.50",
    img:"https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&q=85",
    coords:{lat:21.0285,lon:105.8542}, vibe:"Historia + Comida", clima:"22°C · Variable",
    bestMonth:"Oct–Abr", language:"Vietnamita", currency:"VND", safety:87, authentic:92,
    gems:["Lago Hoan Kiem al amanecer: meditación pública gratis cada día","Pho bo en Pho Bat Dan: el mejor pho del mundo por $1.50","Ha Long Bay en barco local sin tour ($15 ida y vuelta)"],
    warnings:["Tráfico de motos caótico — nunca corras al cruzar","Regatear en mercados es parte de la cultura, no es ofensa"] },

  { id:119, name:"Chiang Mai", country:"Tailandia", region:"Asia", emoji:"🇹🇭",
    price:{mochilero:140,equilibrado:320,premium:950}, rating:4.8, reviews:4123,
    verified:"hace 2 días", verifiedBy:63, tag:"💎 Templos + elefantes éticos",
    img:"https://images.unsplash.com/photo-1528181304800-259b08848526?w=900&q=85",
    coords:{lat:18.7883,lon:98.9853}, vibe:"Naturaleza + Cultura", clima:"25°C · Agradable",
    bestMonth:"Nov–Feb", language:"Tailandés", currency:"THB", safety:90, authentic:90,
    gems:["Doi Suthep al amanecer en moto ($2 gasolina, sin tour)","Santuario de elefantes éticos — sin shows, solo convivencia","Mercado Warorot: donde come la gente local, no los turistas"],
    warnings:["Feb–Abr: quema agrícola, smog extremo — evitar","No senderismo nocturno solo en montaña"] },

  { id:120, name:"Katmandú", country:"Nepal", region:"Asia", emoji:"🇳🇵",
    price:{mochilero:140,equilibrado:320,premium:950}, rating:4.7, reviews:2876,
    verified:"hace 3 días", verifiedBy:38, tag:"💎 Himalaya épico",
    img:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=85",
    coords:{lat:27.7172,lon:85.3240}, vibe:"Espiritualidad + Aventura", clima:"20°C · Variable",
    bestMonth:"Oct–Nov", language:"Nepalí", currency:"NPR", safety:78, authentic:94,
    gems:["Swayambhunath al amanecer: monos, stupa y el Himalaya de fondo","Trekking Annapurna Base Camp 14 días desde $20/día","Bhaktapur: ciudad medieval sin coches ni turistas de crucero"],
    warnings:["Aclimatarse bien antes de subir a altura extrema","Guía local imprescindible en alta montaña"] },

  { id:121, name:"Luang Prabang", country:"Laos", region:"Asia", emoji:"🇱🇦",
    price:{mochilero:160,equilibrado:350,premium:1000}, rating:4.8, reviews:1934,
    verified:"hace 3 días", verifiedBy:27, tag:"💎 Ciudad UNESCO tranquila",
    img:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=85",
    coords:{lat:19.8845,lon:102.1348}, vibe:"Espiritualidad + Naturaleza", clima:"26°C · Agradable",
    bestMonth:"Nov–Feb", language:"Lao", currency:"LAK", safety:93, authentic:95,
    gems:["Ceremonia de monjes al amanecer (5am, en silencio total)","Cascadas Kuang Si: piscinas turquesa en la selva, $3 entrada","Mercado nocturno artesanal: souvenirs a precio justo"],
    warnings:["Internet y señal muy limitados","Vestimenta respetuosa en templos — cubre hombros y rodillas"] },

  // ══ 🌍 ÁFRICA TURÍSTICOS Y JOYAS ══
  { id:122, name:"Marrakech", country:"Marruecos", region:"África", emoji:"🇲🇦",
    price:{mochilero:220,equilibrado:520,premium:1600}, rating:4.8, reviews:4321,
    verified:"hace 1 día", verifiedBy:56, tag:"🧿 Medina laberíntica",
    img:"https://images.unsplash.com/photo-1548018560-c7196548bec6?w=900&q=85",
    coords:{lat:31.6295,lon:-7.9811}, vibe:"Zoco + Desierto", clima:"26°C · Seco",
    bestMonth:"Mar–May", language:"Árabe/Francés", currency:"MAD", safety:78, authentic:88,
    gems:["Jardin Majorelle a las 6am: solo tú y los pájaros","Desierto Merzouga — 2 noches en jaima auténtica ($40)","Hammam local no turístico: ritual de siglos por $5"],
    warnings:["Guías falsos muy insistentes en la medina","Regatear en zocos es imprescindible — precio inicial es x5"] },

  { id:123, name:"Zanzibar", country:"Tanzania", region:"África", emoji:"🇹🇿",
    price:{mochilero:250,equilibrado:600,premium:2000}, rating:4.9, reviews:2876,
    verified:"hace 2 días", verifiedBy:41, tag:"💎 Paraíso árabe-africano",
    img:"https://images.unsplash.com/photo-1548625149-720094d8f04e?w=900&q=85",
    coords:{lat:-6.1659,lon:39.2026}, vibe:"Playa + Historia", clima:"28°C · Tropical",
    bestMonth:"Jun–Oct", language:"Swahili", currency:"TZS", safety:84, authentic:92,
    gems:["Stone Town: laberinto árabe-africano declarado UNESCO","Nungwi Beach: snorkel con tortugas marinas ($10)","Mercado nocturno Forodhani: cena de 3 platos por $2"],
    warnings:["Vestimenta respetuosa en Stone Town (zona islámica)","Regatear es parte de la cultura local"] },

  { id:124, name:"Essaouira", country:"Marruecos", region:"África", emoji:"🇲🇦",
    price:{mochilero:160,equilibrado:380,premium:1100}, rating:4.7, reviews:1543,
    verified:"hace 3 días", verifiedBy:22, tag:"💎 Pueblo azul y blanco",
    img:"https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=900&q=85",
    coords:{lat:31.5085,lon:-9.7595}, vibe:"Playa + Arte", clima:"20°C · Viento",
    bestMonth:"Abr–Jun", language:"Árabe/Francés", currency:"MAD", safety:88, authentic:94,
    gems:["Murallas medievales al sunset: gratis y sin nadie","Festival de Gnawa en junio: música ancestral 3 días gratis","Tagine de pescado fresco en el puerto: $4 el menú completo"],
    warnings:["Viento muy fuerte todo el año (ideal para kitesurf)","Masificación total en julio–agosto"] },

  { id:125, name:"Ciudad del Cabo", country:"Sudáfrica", region:"África", emoji:"🇿🇦",
    price:{mochilero:300,equilibrado:720,premium:2200}, rating:4.8, reviews:3567,
    verified:"hace 2 días", verifiedBy:49, tag:"🦁 Safari + Ciudad",
    img:"https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&q=85",
    coords:{lat:-33.9249,lon:18.4241}, vibe:"Naturaleza + Ciudad", clima:"20°C · Mediterráneo",
    bestMonth:"Nov–Mar", language:"Inglés/Afrikáans", currency:"ZAR", safety:67, authentic:82,
    gems:["Table Mountain al amanecer: caminata o teleférico ($20)","Bo-Kaap: el barrio colorido islámico más fotogénico de África","Boulders Beach: pingüinos africanos en libertad ($10)"],
    warnings:["No caminar solo de noche en ningún barrio","Discreción total con pertenencias y joyería"] },

  // ══ 🕌 MEDIO ORIENTE TURÍSTICOS Y JOYAS ══
  { id:126, name:"Dubái", country:"Emiratos Árabes", region:"Medio Oriente", emoji:"🇦🇪",
    price:{mochilero:560,equilibrado:1400,premium:5000}, rating:4.6, reviews:6234,
    verified:"hace 1 día", verifiedBy:89, tag:"🏙️ Futurista",
    img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=85",
    coords:{lat:25.2048,lon:55.2708}, vibe:"Arquitectura + Lujo", clima:"28°C · Seco",
    bestMonth:"Nov–Mar", language:"Árabe/Inglés", currency:"AED", safety:96, authentic:55,
    gems:["Al Fahidi: el único barrio histórico auténtico de Dubái","Safari desierto al atardecer con cena beduina ($45)","Mercado de especias en Deira: la Dubái real, no el mall"],
    warnings:["Leyes muy estrictas — informarse antes de ir","Alcohol solo en hoteles y restaurantes licenciados"] },

  { id:127, name:"Petra", country:"Jordania", region:"Medio Oriente", emoji:"🇯🇴",
    price:{mochilero:300,equilibrado:640,premium:1800}, rating:5.0, reviews:4891,
    verified:"hace 2 días", verifiedBy:62, tag:"🏺 Maravilla Mundial",
    img:"https://images.unsplash.com/photo-1579606037885-46c4b7289617?w=900&q=85",
    coords:{lat:30.3285,lon:35.4444}, vibe:"Historia + Desierto", clima:"22°C · Seco",
    bestMonth:"Mar–May", language:"Árabe", currency:"JOD", safety:90, authentic:91,
    gems:["El Tesoro al amanecer: llega a las 5:30am y lo tienes solo","El Siq al alba: el cañón de 1.2km en luz dorada","Wadi Rum con beduinos locales ($50 noche + safari)"],
    warnings:["Petra by Night es cara y no vale la pena ($17)","Calor extremo de junio a agosto — evitar"] },

  { id:128, name:"Omán", country:"Omán", region:"Medio Oriente", emoji:"🇴🇲",
    price:{mochilero:320,equilibrado:720,premium:2200}, rating:4.8, reviews:1876,
    verified:"hace 3 días", verifiedBy:28, tag:"💎 Árabe auténtico",
    img:"https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=900&q=85",
    coords:{lat:23.5880,lon:58.3829}, vibe:"Desierto + Mar", clima:"27°C · Seco",
    bestMonth:"Oct–Mar", language:"Árabe", currency:"OMR", safety:97, authentic:93,
    gems:["Wahiba Sands: desierto puro sin masas de turistas","Wadi Shab: piscinas naturales esmeraldas en cañones","Nizwa: mercado de cabras medieval que existe desde el siglo VI"],
    warnings:["Requiere coche de alquiler (transporte público escaso)","Caro en temporada alta — reservar con anticipación"] },

];

const BUDGET_MODES = {
  mochilero:  { icon:"🎒", label:"Mochilero",  desc:"Máximo por mínimo", color:"#22c55e", bg:"rgba(34,197,94,.12)",  border:"rgba(34,197,94,.3)" },
  equilibrado:{ icon:"⚖️", label:"Equilibrado", desc:"Calidad sin excesos", color:"#f59e0b", bg:"rgba(245,158,11,.12)", border:"rgba(245,158,11,.3)" },
  premium:    { icon:"✨", label:"Sin límite",  desc:"La mejor experiencia", color:"#f43f5e", bg:"rgba(244,63,94,.12)",  border:"rgba(244,63,94,.3)" },
};

const VIBES = ["🍽️ Gastronomía","🏖️ Playa","🏛️ Historia","🌿 Naturaleza","🎉 Fiesta","📸 Fotografía","🧘 Bienestar","🤿 Aventura","🛍️ Compras","🎭 Arte & Cultura","💎 Lugares únicos","🚶 Caminar"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI SYSTEM PROMPT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const buildSystemPrompt = (mode, dest) => `Eres noma AI — el asistente de viajes más honesto, útil y personalizado en español. Eres como ese amigo que ha viajado a todos lados y te dice la verdad sin venderte nada.

MODO PRESUPUESTO ACTIVO: ${mode === "mochilero" ? "🎒 MOCHILERO — maximizar experiencias, minimizar gasto. Hostales, transporte público, mercados locales, tours gratuitos." : mode === "equilibrado" ? "⚖️ EQUILIBRADO — buena relación precio/calidad. Hotel boutique 3*, restaurantes locales buenos, algunos tours seleccionados." : "✨ PREMIUM / SIN LÍMITE — la mejor experiencia disponible. Hoteles boutique o 5*, experiencias exclusivas, privacidad y comodidad total."}
${dest ? `DESTINO EN FOCO: ${dest.name}, ${dest.country}` : "MODO LIBRE — el usuario no ha elegido destino todavía"}

TU FILOSOFÍA:
- Honestidad radical: admites cuando algo tiene contras, das rangos reales no cifras inventadas
- Anti-turístico inteligente: recomiendas lo auténtico sobre lo popular, pero nunca pones en riesgo al viajero
- Personalización real: haces preguntas de seguimiento para afinar la recomendación
- Transparencia de fuentes: cuando das precios, explicas que son rangos basados en conocimiento actualizado
- Confianza sobre rapidez: mejor una respuesta detallada y honesta que una respuesta rápida y genérica

CUANDO EL USUARIO PIDE UN ITINERARIO COMPLETO, genera la respuesta normal Y al final incluye exactamente este bloque JSON (sin markdown adicional):

[ITINERARY_JSON]
{
  "destination": "Ciudad, País",
  "duration": "X días",
  "budget_mode": "${mode}",
  "estimated_total": 000,
  "budget_breakdown": { "vuelos": 0, "hospedaje": 0, "comidas": 0, "actividades": 0, "extras": 0 },
  "days": [
    {
      "day": 1,
      "title": "Título evocador",
      "emoji": "🌅",
      "highlights": ["highlight 1", "highlight 2"],
      "items": [
        {
          "time": "09:00",
          "icon": "☕",
          "title": "Nombre de actividad",
          "desc": "Descripción detallada con contexto local",
          "cost_usd": 0,
          "tip": "El tip de local que marca la diferencia",
          "trust": "verificado"
        }
      ]
    }
  ],
  "hidden_gems": ["Joya 1 con contexto específico", "Joya 2", "Joya 3"],
  "money_hacks": ["Hack de presupuesto 1", "Hack 2"],
  "safety_tips": ["Tip de seguridad específico 1", "Tip 2"],
  "best_time": "Mejor época con razón específica",
  "local_phrase": "Frase local útil : traducción"
}
[/ITINERARY_JSON]

FORMATO DE RESPUESTA:
- Usa **negritas** para destacar lo importante
- Usa emojis con criterio, no decorativamente
- Estructura clara: párrafos cortos, listas cuando ayuden
- Siempre termina con una pregunta de seguimiento o invitación a profundizar
- Responde SIEMPRE en español latinoamericano cálido y directo

REGLAS ABSOLUTAS:
1. Nunca inventar precios exactos — siempre rangos: "entre $X y $Y"
2. Nunca recomendar algo solo porque está de moda — solo si genuinamente vale
3. Siempre mencionar la alternativa de menor costo cuando existe
4. Si no sabes algo con certeza, dilo claramente
5. Los "lugares ocultos" deben ser genuinamente menos turísticos`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CSS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400;1,9..144,600&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#0c0806; --s1:#131009; --s2:#1c1610; --s3:#241e15;
  --border:rgba(255,255,255,.06); --border2:rgba(255,255,255,.11);
  --coral:#E8432D; --coral2:#C73520; --corall:#FF8C6E;
  --coralt:rgba(232,67,45,.1); --sandl:#F0C98A;
  --text:#ede9e0; --muted:rgba(237,233,224,.52); --muted2:rgba(237,233,224,.28);
  --green:#22c55e; --greent:rgba(34,197,94,.1);
  --blue:#38bdf8; --bluet:rgba(56,189,248,.1);
  --red:#f43f5e; --redt:rgba(244,63,94,.1);
  --amber:#f59e0b; --ambrt:rgba(245,158,11,.1);
  --nav:62px;
}
body{background:var(--bg);color:var(--text);font-family:'Instrument Sans',sans-serif;line-height:1.6;overflow-x:hidden;min-height:100vh}
::selection{background:var(--coralt);color:var(--corall)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--coral),var(--coral2));border-radius:3px}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes slideRight{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes pulseGold{0%,100%{box-shadow:0 0 0 0 rgba(232,67,45,.4)}70%{box-shadow:0 0 0 18px rgba(232,67,45,0)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes coralFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes typing{0%,60%,100%{transform:none;opacity:.35}30%{transform:translateY(-5px);opacity:1}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes progressPulse{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes destIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}

.fu{animation:fadeUp .55s cubic-bezier(.23,1,.32,1) both}
.fi{animation:fadeIn .35s ease both}
.si{animation:scaleIn .45s cubic-bezier(.23,1,.32,1) both}
.sr{animation:slideRight .4s cubic-bezier(.23,1,.32,1) both}
.float-anim{animation:float 5s ease-in-out infinite}

/* GOLD TEXT */
.coral{
  background:linear-gradient(135deg,#E8432D 0%,#FF8C6E 50%,#C73520 100%);
  background-size:200% 200%;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.coral-flow{animation:coralFlow 4s linear infinite}

/* TYPOGRAPHY */
.serif{font-family:'Fraunces',serif}
.label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:var(--coral);display:block}

/* LAYOUT */
.container{max-width:1240px;margin:0 auto;padding:0 28px}
.container-sm{max-width:900px;margin:0 auto;padding:0 24px}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:'Instrument Sans',sans-serif;font-weight:600;cursor:pointer;border:none;transition:all .22s cubic-bezier(.23,1,.32,1);white-space:nowrap;text-decoration:none}
.btn-primary{background:linear-gradient(135deg,#E8432D,#C73520);color:#07070f;padding:15px 30px;border-radius:100px;font-size:14px;letter-spacing:-.1px}
.btn-primary:hover{transform:translateY(-2px) scale(1.025);box-shadow:0 12px 40px rgba(232,67,45,.38);filter:brightness(1.07)}
.btn-primary:active{transform:scale(.97)}
.btn-primary:disabled{opacity:.38;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn-ghost{background:rgba(255,255,255,.055);color:var(--text);border:1px solid var(--border2);padding:13px 22px;border-radius:100px;font-size:13px}
.btn-ghost:hover{background:var(--coralt);border-color:rgba(232,67,45,.35);color:var(--coral)}
.btn-ghost.active{background:var(--coralt);border-color:var(--coral);color:var(--coral)}
.btn-sm{padding:9px 18px!important;font-size:12px!important}
.btn-xs{padding:6px 13px!important;font-size:11px!important;border-radius:100px!important}

/* INPUTS */
.inp{background:var(--s2);border:1.5px solid var(--border);color:var(--text);padding:14px 18px;border-radius:14px;font-family:'Instrument Sans',sans-serif;font-size:14px;width:100%;outline:none;transition:border .2s,background .2s,box-shadow .2s}
.inp:focus{border-color:var(--coral);background:rgba(232,67,45,.04);box-shadow:0 0 0 4px rgba(232,67,45,.1)}
.inp::placeholder{color:var(--muted2)}
.inp option{background:var(--s1)}
textarea.inp{resize:none;line-height:1.6}

/* CARDS */
.card{background:var(--s1);border:1px solid var(--border);border-radius:22px;transition:all .3s cubic-bezier(.23,1,.32,1)}
.card-hover:hover{transform:translateY(-9px);border-color:rgba(232,67,45,.28);box-shadow:0 28px 72px rgba(0,0,0,.55),0 0 0 1px rgba(232,67,45,.12)}

/* TAGS & BADGES */
.tag{display:inline-flex;align-items:center;gap:5px;background:var(--coralt);color:var(--coral);padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.3px;border:1px solid rgba(232,67,45,.18)}
.badge-green{background:var(--greent);color:var(--green);border:1px solid rgba(34,197,94,.2);padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px}
.badge-blue{background:var(--bluet);color:var(--blue);border:1px solid rgba(56,189,248,.2);padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px}
.badge-red{background:var(--redt);color:var(--red);border:1px solid rgba(244,63,94,.2);padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--nav);display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(7,7,15,.88);backdrop-filter:blur(32px);border-bottom:1px solid var(--border)}

/* GLASS */
.glass{background:rgba(255,255,255,.035);backdrop-filter:blur(22px);border:1px solid var(--border)}

/* TRUST BAR */
.trust-bar{height:3px;border-radius:100px;background:rgba(255,255,255,.06);overflow:hidden;margin-top:8px}
.trust-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--green),#4ade80);transition:width .8s cubic-bezier(.23,1,.32,1)}

/* CHAT */
.chat-wrap{display:flex;gap:11px;align-items:flex-start;animation:fadeUp .35s ease both;margin-bottom:18px}
.chat-wrap.user{flex-direction:row-reverse}
.bubble{max-width:80%;padding:13px 17px;border-radius:18px;font-size:14px;line-height:1.72}
.bubble-ai{background:var(--s2);border:1px solid var(--border);border-top-left-radius:4px;color:var(--text)}
.bubble-user{background:linear-gradient(135deg,#E8432D,#C73520);color:#07070f;font-weight:500;border-top-right-radius:4px}
.av{width:33px;height:33px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.av-ai{background:linear-gradient(135deg,var(--coral),var(--coral2));box-shadow:0 4px 18px rgba(232,67,45,.32)}
.av-user{background:var(--s3);border:1px solid var(--border2);font-size:13px}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--muted);display:inline-block;margin:0 2px}
.typing-dot:nth-child(1){animation:typing 1.1s ease 0s infinite}
.typing-dot:nth-child(2){animation:typing 1.1s ease .2s infinite}
.typing-dot:nth-child(3){animation:typing 1.1s ease .4s infinite}

/* TIMELINE */
.tl{display:flex;gap:13px;margin-bottom:18px;animation:slideRight .38s ease both}
.tl-icon{width:42px;height:42px;border-radius:13px;background:var(--coralt);border:1.5px solid rgba(232,67,45,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;transition:all .2s;cursor:default}
.tl:hover .tl-icon{background:rgba(232,67,45,.18);transform:scale(1.07)}
.tl-card{flex:1;background:var(--s2);border:1px solid var(--border);border-radius:16px;padding:15px 18px;transition:border .2s}
.tl:hover .tl-card{border-color:rgba(232,67,45,.18)}
.tl-line{width:2px;flex:1;background:linear-gradient(to bottom,rgba(232,67,45,.2),rgba(232,67,45,.03));border-radius:2px;margin-top:6px}

/* GEMS */
.gem{display:flex;gap:11px;align-items:flex-start;padding:13px 15px;border-radius:13px;background:var(--s2);border:1px solid var(--border);transition:all .2s;margin-bottom:9px}
.gem:hover{border-color:rgba(232,67,45,.22);background:rgba(232,67,45,.04);transform:translateX(3px)}
.gem-icon{font-size:20px;flex-shrink:0;margin-top:1px}

/* BUDGET SELECTOR */
.budget-mode-btn{padding:14px 18px;border-radius:14px;cursor:pointer;border:2px solid var(--border);background:var(--s2);transition:all .2s;text-align:left;width:100%}

/* CHIPS */
.chip{padding:8px 15px;border-radius:100px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid var(--border);background:var(--s2);color:var(--muted);transition:all .18s;font-family:'Instrument Sans',sans-serif}
.chip:hover{border-color:rgba(232,67,45,.35);color:var(--coral);background:var(--coralt)}

/* SCROLL */
.scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(232,67,45,.25) transparent}

/* SAFE DOT */
.safe-dot{width:9px;height:9px;border-radius:50%;display:inline-block;flex-shrink:0}

/* SEARCH */
.search-wrap{position:relative}
.search-wrap .icon{position:absolute;left:15px;top:50%;transform:translateY(-50%);opacity:.45;pointer-events:none}

/* GRID */
.dest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px}
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}

/* MOBILE */
@media(max-width:720px){
  .nav .nav-center,.nav .hide-m{display:none!important}
  .dest-grid{grid-template-columns:1fr}
  .feat-grid{grid-template-columns:1fr 1fr}
  .hero-h1{font-size:44px!important;letter-spacing:-2.5px!important}
  .budget-row{flex-direction:column!important}
  .container,.container-sm{padding:0 16px}
  .nav{padding:0 16px}
  .chat-section{padding:0!important}
}
@media(max-width:480px){
  .feat-grid{grid-template-columns:1fr}
  .budget-row button{flex:1 1 100%!important}
}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const parseItinerary = txt => {
  try {
    const m = txt.match(/\[ITINERARY_JSON\]([\s\S]*?)\[\/ITINERARY_JSON\]/);
    if (m) return JSON.parse(m[1].trim());
  } catch {}
  return null;
};
const cleanText = txt => txt.replace(/\[ITINERARY_JSON\][\s\S]*?\[\/ITINERARY_JSON\]/, "").trim();
const safeColor = n => n >= 90 ? "#22c55e" : n >= 80 ? "#f59e0b" : "#f97316";
const fmtUSD = n => `$${Number(n).toLocaleString()}`;
const renderMd = t => t
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/_(.*?)_/g, "<em>$1</em>")
  .replace(/`(.*?)`/g, "<code style='background:rgba(255,255,255,.08);padding:1px 6px;border-radius:5px;font-size:12px'>$1</code>");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SafeBadge({ score }) {
  const c = safeColor(score);
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:100, background:`${c}18`, color:c, border:`1px solid ${c}30` }}>
      <span className="safe-dot" style={{ background:c, boxShadow:`0 0 6px ${c}` }} />
      {score}% seguro
    </span>
  );
}

function VerifiedBadge({ verified, by }) {
  return (
    <span className="badge-green">
      <span>✓</span> Verificado {verified} · {by} viajeros
    </span>
  );
}

function BudgetTag({ mode }) {
  const m = BUDGET_MODES[mode];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:100, background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
      {m.icon} {m.label}
    </span>
  );
}

function TypingBubble() {
  return (
    <div className="chat-wrap fi">
      <div className="av av-ai">✦</div>
      <div className="bubble bubble-ai" style={{ padding:"14px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          <span style={{ fontSize:12, color:"var(--muted)", marginLeft:8 }}>noma AI está pensando...</span>
        </div>
      </div>
    </div>
  );
}

function ItineraryBlock({ data, onNew }) {
  const [day, setDay] = useState(0);
  if (!data) return null;
  const total = data.estimated_total || Object.values(data.budget_breakdown || {}).reduce((a, b) => a + b, 0);
  const bm = BUDGET_MODES[data.budget_mode] || BUDGET_MODES.equilibrado;

  return (
    <div className="si" style={{ marginTop:16 }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,rgba(232,67,45,.08),rgba(232,67,45,.03))", border:"1px solid rgba(232,67,45,.15)", borderRadius:20, padding:"22px 24px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
          <div>
            <span className="label" style={{ marginBottom:8 }}>✦ Itinerario · noma AI</span>
            <h3 className="serif" style={{ fontSize:26, fontWeight:700, letterSpacing:-1, marginBottom:10 }}>{data.destination}</h3>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {[`📅 ${data.duration}`, `💰 ~${fmtUSD(total)} est.`].map((x,i) => (
                <span key={i} style={{ fontSize:12, color:"var(--muted)" }}>{x}</span>
              ))}
              <BudgetTag mode={data.budget_mode || "equilibrado"} />
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onNew}>+ Nuevo viaje</button>
        </div>
      </div>

      {/* Budget breakdown */}
      {data.budget_breakdown && (
        <div className="card" style={{ padding:"20px 22px", marginBottom:18 }}>
          <span className="label" style={{ marginBottom:14 }}>Presupuesto estimado</span>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
            {[["✈️","Vuelos",data.budget_breakdown.vuelos],["🏨","Hospedaje",data.budget_breakdown.hospedaje],["🍽️","Comidas",data.budget_breakdown.comidas],["🎭","Activ.",data.budget_breakdown.actividades],["💰","TOTAL",total]].map(([icon,lbl,amt],i) => (
              <div key={i} style={{ textAlign:"center", padding:"13px 6px", borderRadius:12, background:i===4?"var(--coralt)":"var(--s2)", border:`1px solid ${i===4?"rgba(232,67,45,.25)":"var(--border)"}` }}>
                <div style={{ fontSize:18, marginBottom:5 }}>{icon}</div>
                <div style={{ fontSize:9, color:"var(--muted2)", textTransform:"uppercase", letterSpacing:".5px", marginBottom:3 }}>{lbl}</div>
                <div className={i===4?"gold serif":""} style={{ fontSize:i===4?18:15, fontWeight:700 }}>{amt?fmtUSD(amt):"—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day tabs */}
      {data.days?.length > 0 && (
        <>
          <div style={{ display:"flex", gap:9, marginBottom:20, flexWrap:"wrap" }}>
            {data.days.map((d, i) => (
              <button key={i} onClick={() => setDay(i)}
                style={{ flex:"1 1 100px", padding:"13px 10px", borderRadius:14, cursor:"pointer", textAlign:"center", border:day===i?"2px solid var(--coral)":"1.5px solid var(--border)", background:day===i?"var(--coralt)":"var(--s2)", transition:"all .2s" }}>
                <div style={{ fontSize:19, marginBottom:4 }}>{d.emoji || "📍"}</div>
                <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:1.5, color:day===i?"var(--coral)":"var(--muted2)", marginBottom:2 }}>Día {d.day}</div>
                <div style={{ fontSize:11, fontWeight:600, color:day===i?"var(--text)":"var(--muted)" }}>{d.title}</div>
              </button>
            ))}
          </div>

          <div key={day}>
            {data.days[day]?.highlights?.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {data.days[day].highlights.map((h, i) => (
                  <span key={i} className="badge-blue">{h}</span>
                ))}
              </div>
            )}
            {(data.days[day]?.items || []).map((item, i) => (
              <div key={i} className="tl" style={{ animationDelay:`${i*.07}s` }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                  <div className="tl-icon">{item.icon}</div>
                  {i < data.days[day].items.length-1 && <div className="tl-line" />}
                </div>
                <div className="tl-card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:7 }}>
                    <span style={{ fontSize:12, color:"var(--coral)", fontWeight:700, letterSpacing:.3 }}>{item.time}</span>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {item.cost_usd > 0 && <span className="tag" style={{ fontSize:10, padding:"2px 9px" }}>~{fmtUSD(item.cost_usd)}</span>}
                      {item.trust === "verificado" && <span className="badge-green">✓ verificado</span>}
                    </div>
                  </div>
                  <p className="serif" style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>{item.title}</p>
                  <p style={{ fontSize:13, color:"rgba(237,233,224,.72)", lineHeight:1.68, marginBottom:item.tip?10:0 }}>{item.desc}</p>
                  {item.tip && (
                    <div style={{ display:"flex", gap:9, padding:"10px 13px", borderRadius:10, background:"rgba(232,67,45,.07)", border:"1px solid rgba(232,67,45,.15)", marginTop:6 }}>
                      <span style={{ fontSize:14, flexShrink:0 }}>💡</span>
                      <span style={{ fontSize:12, color:"rgba(237,233,224,.7)", lineHeight:1.55 }}><strong style={{ color:"var(--coral)" }}>Tip local:</strong> {item.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Extras */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:20 }}>
        {data.hidden_gems?.length > 0 && (
          <div className="card" style={{ padding:"18px 20px" }}>
            <span className="label" style={{ marginBottom:13 }}>💎 Joyas ocultas</span>
            {data.hidden_gems.map((g,i) => (
              <div key={i} className="gem">
                <span className="gem-icon">💎</span>
                <span style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>{g}</span>
              </div>
            ))}
          </div>
        )}
        {(data.money_hacks?.length > 0 || data.safety_tips?.length > 0) && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {data.money_hacks?.length > 0 && (
              <div className="card" style={{ padding:"16px 18px" }}>
                <span className="label" style={{ marginBottom:11 }}>💰 Ahorra más</span>
                {data.money_hacks.map((h,i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:7, fontSize:12, color:"var(--muted)" }}>
                    <span style={{ color:"var(--coral)", flexShrink:0 }}>→</span><span>{h}</span>
                  </div>
                ))}
              </div>
            )}
            {data.safety_tips?.length > 0 && (
              <div style={{ background:"var(--bluet)", border:"1px solid rgba(56,189,248,.15)", borderRadius:16, padding:"16px 18px" }}>
                <span className="label" style={{ color:"var(--blue)", marginBottom:11 }}>⚠️ Ten en cuenta</span>
                {data.safety_tips.map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:7, fontSize:12, color:"rgba(237,233,224,.65)" }}>
                    <span style={{ color:"var(--blue)", flexShrink:0 }}>•</span><span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {data.local_phrase && (
        <div style={{ marginTop:14, background:"var(--coralt)", border:"1px solid rgba(232,67,45,.2)", borderRadius:14, padding:"14px 18px", display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:20 }}>🗣️</span>
          <div>
            <div style={{ fontSize:11, color:"var(--coral)", fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>Frase local útil</div>
            <div style={{ fontSize:14, fontStyle:"italic" }}>{data.local_phrase}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DestCard({ d, mode, onChat }) {
  const [hovered, setHovered] = useState(false);
  const bm = BUDGET_MODES[mode];
  return (
    <div className="card card-hover"
      style={{ borderRadius:22, overflow:"hidden", cursor:"pointer", animation:"destIn .5s ease both" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onChat}>
      <div style={{ position:"relative", height:216, overflow:"hidden" }}>
        <img src={d.img} alt={d.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .6s cubic-bezier(.23,1,.32,1)", transform:hovered?"scale(1.08)":"scale(1)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(7,7,15,.94) 0%,rgba(7,7,15,.3) 55%,transparent 100%)" }} />
        {/* Tags */}
        <div style={{ position:"absolute", top:13, left:13, right:13, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span className="tag" style={{ fontSize:10 }}>{d.tag}</span>
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:100, background:"rgba(7,7,15,.7)", color:safeColor(d.safe), backdropFilter:"blur(8px)", border:`1px solid ${safeColor(d.safe)}30` }}>
            🛡️ {d.safe}%
          </span>
        </div>
        {/* Country emoji */}
        <div style={{ position:"absolute", bottom:70, left:16, fontSize:24 }}>{d.emoji}</div>
        <div style={{ position:"absolute", bottom:14, left:16, right:16 }}>
          <h3 className="serif" style={{ fontSize:22, fontWeight:700, letterSpacing:"-.5px", marginBottom:2 }}>{d.name}</h3>
          <p style={{ fontSize:12, color:"rgba(237,233,224,.65)" }}>{d.country} · {d.vibe} · {d.climate}</p>
        </div>
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div className="gold serif" style={{ fontSize:22, fontWeight:700 }}>{fmtUSD(d.price[mode])}</div>
            <div style={{ fontSize:10, color:"var(--muted2)", textTransform:"uppercase", letterSpacing:".5px", marginTop:1 }}>modo {mode} · {d.duration}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:13, marginBottom:5 }}>⭐ <strong>{d.rating}</strong> <span style={{ fontSize:10, color:"var(--muted2)" }}>({d.reviews.toLocaleString()})</span></div>
            <VerifiedBadge verified={d.verified} by={d.verifiedBy} />
          </div>
        </div>
        {/* Gems preview */}
        <div style={{ display:"flex", gap:6, marginBottom:13, flexWrap:"wrap" }}>
          <span className="badge-green">💎 {d.gems.length} joyas locales</span>
          <span className="badge-blue">📅 {d.best_months}</span>
          <BudgetTag mode={mode} />
        </div>
        {/* Hidden score bar */}
        <div style={{ marginBottom:13 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:10, color:"var(--muted2)", textTransform:"uppercase", letterSpacing:1 }}>Autenticidad local</span>
            <span style={{ fontSize:11, fontWeight:700, color:"var(--green)" }}>{d.hidden_score}%</span>
          </div>
          <div className="trust-bar"><div className="trust-fill" style={{ width:`${d.hidden_score}%` }} /></div>
        </div>
        <button className="btn btn-primary" style={{ width:"100%", padding:"12px", fontSize:13 }} onClick={e => { e.stopPropagation(); onChat(); }}>
          ✦ Planificar con IA →
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Noma() {
  const [screen, setScreen] = useState("home");
  const [showSavedTrips, setShowSavedTrips] = useState(false);
  const [budgetMode, setBudgetMode] = useState("equilibrado");
  const [regionFilter, setRegionFilter] = useState("Todos");
  const [searchQ, setSearchQ] = useState("");
  const [activeDest, setActiveDest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [itineraryMsgIdx, setItineraryMsgIdx] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const regions = ["Todos","Latinoamérica","Europa","Asia","África"];
  const filtered = DESTINATIONS.filter(d => {
    const r = regionFilter === "Todos" || d.region === regionFilter;
    const q = !searchQ || d.name.toLowerCase().includes(searchQ.toLowerCase()) || d.country.toLowerCase().includes(searchQ.toLowerCase()) || d.vibe.toLowerCase().includes(searchQ.toLowerCase());
    return r && q;
  });

  const buildWelcome = (dest) => {
    if (dest) {
      const bm = BUDGET_MODES[budgetMode];
      return `¡Hola! Soy **noma AI** ✦\n\nVeo que te llama **${dest.name}, ${dest.country}** ${dest.emoji} — muy buena elección. Estás en modo **${bm.icon} ${bm.label}**, así que voy a darte exactamente lo que necesitas para ese perfil.\n\n📊 Presupuesto estimado en modo ${bm.label}: **${fmtUSD(dest.price[budgetMode])} por persona**\n🛡️ Índice de seguridad: **${dest.safe}%** — ${dest.safe >= 85 ? "excelente" : dest.safe >= 78 ? "bueno con precauciones básicas" : "requiere atención extra"}\n📅 Mejor época: **${dest.best_months}**\n🌡️ Clima: **${dest.climate}**\n\nTengo **${dest.gems.length} joyas locales** para compartirte que la mayoría de viajeros nunca descubren.\n\nPara crear tu itinerario perfecto, dime:\n• ¿Cuántos días tienes?\n• ¿Viajas solo/a, en pareja, con amigos o familia?\n• ¿Qué no puede faltarte? ¿Hay algo que definitivamente no quieres?\n\n¡Cuéntame y armo algo único para ti! 🌍`;
    }
    const bm = BUDGET_MODES[budgetMode];
    return `¡Hola! Soy **noma AI** ✦ — tu asesor de viajes personal en español.\n\nEstás en modo **${bm.icon} ${bm.label}** — ${bm.desc}. Puedo cambiarlo en cualquier momento.\n\nEstoy aquí para ayudarte a:\n\n🗺️ **Planificar itinerarios reales** con precios verificados\n💎 **Descubrir lugares auténticos** que Google turístico no muestra\n💰 **Optimizar cada dólar** sin sacrificar experiencias\n🛡️ **Viajar seguro** con tips de locales que ya estuvieron ahí\n\n¿A dónde sueñas ir? ¿Tienes un destino en mente o quieres que te ayude a elegir según tu presupuesto y gustos?`;
  };

    const saveItinerary = () => {
    if (!activeDest) return;
    const lastAiMsg = messages.filter(m => m.role === 'assistant').pop();
    if (!lastAiMsg) return;
    
    const trip = {
      id: Date.now(),
      destination: activeDest.name,
      date: new Date().toISOString(),
      budget: budgetMode === 'backpacker' ? 'Mochilero' : budgetMode === 'balanced' ? 'Equilibrado' : 'Sin límite',
      days: activeDest.dura || '7',
      summary: lastAiMsg.content.slice(0, 500) + '...',
      fullContent: lastAiMsg.content
    };
    
    const existing = JSON.parse(localStorage.getItem('noma_trips') || '[]');
    localStorage.setItem('noma_trips', JSON.stringify([trip, ...existing]));
    alert('✅ Itinerario guardado');
  };

const initChat = (dest = null) => {
    setActiveDest(dest);
    setItinerary(null);
    setItineraryMsgIdx(null);
    const welcome = { role:"assistant", content:buildWelcome(dest) };
    setMessages([welcome]);
    setScreen("chat");
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const sendMsg = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role:"user", content:text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    if (inputRef.current) { inputRef.current.style.height = "auto"; }

    try {
      const apiMsgs = next.map(m => ({ role:m.role, content:m.content }));
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-calls": "true" },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:buildSystemPrompt(budgetMode, activeDest),
          messages:apiMsgs
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Algo salió mal. ¿Puedes intentarlo de nuevo?";
      const parsed = parseItinerary(raw);
      const clean = parsed ? cleanText(raw) : raw;
      const newIdx = next.length; // index of the assistant reply in the upcoming state
      if (parsed) { setItinerary(parsed); setItineraryMsgIdx(newIdx); }
      setMessages(prev => [...prev, { role:"assistant", content:clean, hasItinerary:!!parsed }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"No pude conectarme. Verifica tu conexión e inténtalo de nuevo 🔄" }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, loading, budgetMode, activeDest]);

  const quickReplies = activeDest ? [
    `Dame el itinerario completo de 5 días para ${activeDest.name}`,
    "¿Cuáles son los lugares más auténticos y menos turísticos?",
    "¿Cuánto cuesta realmente hospedarse? Da rangos honestos",
    "Tips de seguridad específicos y estafas a evitar",
    "¿Cuál es el mejor mes para ir y por qué?",
    "¿Qué comer que no encuentre en un restaurante turístico?",
  ] : [
    "Quiero ir a algún lugar único y poco conocido en Latinoamérica",
    "Tengo $500 y 7 días. ¿A dónde me recomiendas ir?",
    "¿Cuál es el mejor destino europeo para viajeros de bajo presupuesto?",
    "Quiero vivir una experiencia gastronómica auténtica. ¿Dónde?",
    "Ayúdame a elegir entre Cartagena, Oaxaca y Buenos Aires",
    "¿Qué destino es sorprendentemente barato pero increíble?",
  ];

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", color:"var(--text)" }}>
      <style>{CSS}</style>

      {/* ═══════════════════════════════════════
          NAV
      ═══════════════════════════════════════ */}
      <nav className="nav">
        {/* Logo */}
        <div onClick={() => setScreen("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#E8432D,#C73520)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 18px rgba(232,67,45,.32)" }}>🧭</div>
          <span className="serif" style={{ fontSize:23, fontWeight:700, letterSpacing:"-1.5px" }}>noma<span className="coral">.</span></span>
        </div>

        {/* Center tabs */}
        <div className="nav-center" style={{ display:"flex", gap:3, background:"rgba(255,255,255,.04)", borderRadius:100, padding:"4px", border:"1px solid var(--border)" }}>
          {[["home","🗺️","Explorar"],["chat","✦","Planificar con IA"]].map(([s,icon,lbl]) => (
            <button key={s} onClick={() => s==="chat" ? initChat() : setScreen(s)}
              style={{ padding:"8px 20px", borderRadius:100, border:"none", cursor:"pointer", fontFamily:"'Instrument Sans',sans-serif", fontSize:13, fontWeight:600, transition:"all .2s", background:screen===s?"rgba(232,67,45,.14)":"transparent", color:screen===s?"var(--coral)":"var(--muted)" }}>
              {icon} {lbl}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display:"flex", gap:9, alignItems:"center" }}>
          {/* Budget quick-switch */}
          <div className="hide-m" style={{ display:"flex", gap:3, background:"rgba(255,255,255,.04)", borderRadius:100, padding:"3px", border:"1px solid var(--border)" }}>
            {Object.entries(BUDGET_MODES).map(([k, v]) => (
              <button key={k} onClick={() => setBudgetMode(k)} title={v.desc}
                style={{ padding:"6px 13px", borderRadius:100, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, transition:"all .2s", background:budgetMode===k?v.bg:"transparent", color:budgetMode===k?v.color:"var(--muted)" }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => initChat()}>✦ Planificar gratis</button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HOME
      ═══════════════════════════════════════ */}
      {screen === "home" && (
        <div style={{ paddingTop:"var(--nav)" }}>

          {/* ── HERO ── */}
          <section style={{ position:"relative", minHeight:720, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
            {/* BG */}
            <div style={{ position:"absolute", inset:0, background:"url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1800&q=85) center/cover no-repeat", filter:"brightness(.18) saturate(1.6)" }} />
            <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 100%, transparent 15%, var(--bg) 68%)" }} />
            {/* Orbs */}
            {[["-5%","10%","500px","rgba(232,67,45,.07)"],["auto","5%","380px","rgba(199,53,32,.05)","5%"]].map(([l,t,sz,c,r],i) => (
              <div key={i} style={{ position:"absolute", left:l, right:r||"auto", top:t, width:sz, height:sz, background:`radial-gradient(circle,${c},transparent 65%)`, borderRadius:"50%", pointerEvents:"none" }} />
            ))}
            {/* Content */}
            <div style={{ position:"relative", textAlign:"center", padding:"80px 24px", maxWidth:840, zIndex:1, opacity:heroVisible?1:0, transform:heroVisible?"none":"translateY(20px)", transition:"opacity .8s ease, transform .8s cubic-bezier(.23,1,.32,1)" }}>
              <span className="tag float-anim" style={{ marginBottom:30, display:"inline-flex", fontSize:12 }}>
                ✦ La comunidad nómada en español · IA real · 100% gratis
              </span>
              <h1 className="hero-h1 serif" style={{ fontSize:"clamp(48px,8vw,86px)", fontWeight:700, lineHeight:1.01, marginBottom:28, letterSpacing:"-4px" }}>
                El mundo<br /><span className="coral coral-flow">es tu casa.</span><br /><em style={{ fontWeight:300, fontSize:"85%", letterSpacing:"-2px" }}>Empieza a vivirlo.</em>
              </h1>
              <p style={{ fontSize:"clamp(15px,2.2vw,19px)", color:"var(--muted)", lineHeight:1.72, marginBottom:52, maxWidth:580, margin:"0 auto 52px" }}>
                La primera comunidad nómada en español con <strong style={{ color:"var(--text)" }}>IA conversacional real</strong>, precios verificados por viajeros y joyas ocultas que Google no te muestra.
              </p>

              {/* Budget selector */}
              <div className="budget-row" style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:40, flexWrap:"wrap" }}>
                {Object.entries(BUDGET_MODES).map(([k, v]) => (
                  <button key={k} onClick={() => setBudgetMode(k)}
                    style={{ flex:"1 1 160px", maxWidth:210, padding:"14px 18px", borderRadius:16, cursor:"pointer", border:`2px solid ${budgetMode===k?v.color:"var(--border)"}`, background:budgetMode===k?v.bg:"rgba(255,255,255,.03)", textAlign:"left", transition:"all .22s", outline:"none" }}>
                    <div style={{ fontSize:16, marginBottom:4 }}>{v.icon}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:budgetMode===k?v.color:"var(--text)", marginBottom:2 }}>{v.label}</div>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{v.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ display:"flex", gap:13, justifyContent:"center", flexWrap:"wrap" }}>
                <button className="btn btn-primary" onClick={() => initChat()} style={{ fontSize:16, padding:"18px 44px", animation:"pulseGold 2.8s infinite" }}>
                  ✦ Hablar con la IA gratis
                </button>
                <button className="btn btn-ghost" onClick={() => document.getElementById("destinos")?.scrollIntoView({ behavior:"smooth" })} style={{ fontSize:15, padding:"16px 28px" }}>
                  Ver destinos 👇
                </button>
              </div>

              {/* Trust pills */}
              <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:56, flexWrap:"wrap" }}>
                {[["✓","Precios verificados"],["💎","Joyas que Google oculta"],["🛡️","Rutas seguras"],["🤝","Sin comisiones"]].map(([icon,lbl],i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--muted)", fontWeight:500 }}>
                    <span style={{ color:"var(--coral)" }}>{icon}</span>{lbl}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section style={{ background:"rgba(232,67,45,.04)", borderTop:"1px solid rgba(232,67,45,.09)", borderBottom:"1px solid rgba(232,67,45,.09)", padding:"60px 28px" }}>
            <div style={{ maxWidth:980, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:36 }}>
              {[
                ["💬","Conversas","No hay formularios. Dile a la IA cómo eres, cuánto tienes y qué buscas."],
                ["🤖","La IA analiza","Personaliza según tu presupuesto, estilo y preferencias únicas. No genérico."],
                ["💎","Descubres","Lugares auténticos que los blogs no mencionan, con precios reales y tips locales."],
                ["✅","Confías","Cada dato tiene fuente y verificación de viajeros reales. Transparencia total."],
              ].map(([icon, title, desc], i) => (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:36, marginBottom:14 }}>{icon}</div>
                  <div className="serif" style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{title}</div>
                  <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.68 }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── DESTINATIONS ── */}
          <section id="destinos" style={{ padding:"72px 28px", maxWidth:1280, margin:"0 auto" }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:34, flexWrap:"wrap", gap:20 }}>
              <div>
                <span className="label" style={{ marginBottom:12 }}>Destinos verificados ✦</span>
                <h2 className="serif" style={{ fontSize:"clamp(30px,5vw,48px)", fontWeight:700, letterSpacing:"-2px", lineHeight:1.05 }}>
                  Explora con <span className="coral">confianza</span>
                </h2>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"flex-end" }}>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {regions.map(r => (
                    <button key={r} className={`btn btn-ghost btn-xs ${regionFilter===r?"active":""}`} onClick={() => setRegionFilter(r)}>{r}</button>
                  ))}
                </div>
                <div className="search-wrap">
                  <span className="icon">🔍</span>
                  <input className="inp" placeholder="Ciudad, país, experiencia..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    style={{ paddingLeft:40, width:260, padding:"9px 14px 9px 38px", borderRadius:100, fontSize:13 }} />
                </div>
              </div>
            </div>

            {/* Budget mode reminder */}
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:28, padding:"13px 18px", borderRadius:14, background:"var(--coralt)", border:"1px solid rgba(232,67,45,.18)", flexWrap:"wrap" }}>
              <span style={{ fontSize:14 }}>{BUDGET_MODES[budgetMode].icon}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--coral)" }}>Modo {BUDGET_MODES[budgetMode].label}</span>
              <span style={{ fontSize:13, color:"var(--muted)" }}>— Los precios y recomendaciones se adaptan a tu perfil</span>
              <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                {Object.entries(BUDGET_MODES).map(([k, v]) => (
                  <button key={k} onClick={() => setBudgetMode(k)} className="btn btn-xs"
                    style={{ border:`1.5px solid ${budgetMode===k?v.color:"var(--border)"}`, background:budgetMode===k?v.bg:"transparent", color:budgetMode===k?v.color:"var(--muted)", fontFamily:"'Instrument Sans',sans-serif", fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:100, cursor:"pointer", transition:"all .2s" }}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="dest-grid">
              {filtered.map((d, i) => (
                <div key={d.id} style={{ animationDelay:`${i*.045}s` }}>
                  <DestCard d={d} mode={budgetMode} onChat={() => initChat(d)} />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"80px 24px" }}>
                <div style={{ fontSize:52, marginBottom:16 }}>🌐</div>
                <h3 className="serif" style={{ fontSize:24, marginBottom:10 }}>Sin resultados para "{searchQ}"</h3>
                <p style={{ color:"var(--muted)", marginBottom:24 }}>Prueba con otra ciudad, país o tipo de experiencia</p>
                <button className="btn btn-ghost" onClick={() => { setSearchQ(""); setRegionFilter("Todos"); }}>Ver todos los destinos</button>
              </div>
            )}
          </section>

          {/* ── TRUST SECTION ── */}
          <section style={{ background:"var(--s1)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"76px 28px" }}>
            <div className="container">
              <div style={{ textAlign:"center", marginBottom:60 }}>
                <span className="label" style={{ display:"block", marginBottom:12 }}>Por qué noma. es diferente ✦</span>
                <h2 className="serif" style={{ fontSize:"clamp(28px,5vw,46px)", fontWeight:700, letterSpacing:"-2px" }}>Nómadas que confían en nómadas</h2>
              </div>
              <div className="feat-grid">
                {[
                  ["🔍","Transparencia total de fuentes","Cada precio muestra su origen y fecha. No inventamos datos — damos rangos reales de múltiples fuentes actualizadas.",93],
                  ["💎","Joyas que Google no indexa","Lugares auténticos sin presupuesto SEO pero extraordinarios. Validados por personas reales que estuvieron en los últimos 6 meses.",97],
                  ["🛡️","Índice de seguridad real","Basado en reportes verificados de incidentes, no en percepciones. Con alertas específicas por zona y horario.",94],
                  ["🤝","Sin comisiones ocultas","noma no cobra por mandarte a ningún hotel o tour. Recomendamos lo mejor para ti. Cuando nos moneticemos, será por suscripción.",100],
                  ["🤖","IA que realmente personaliza","No es un chatbot genérico. Entiende tu presupuesto, estilo y preferencias para crear algo único. Hace preguntas de seguimiento.",91],
                  ["🔄","Verificación constante","Los viajeros que usan noma pueden validar o corregir la información. La comunidad mantiene los datos frescos.",88],
                ].map(([icon, title, desc, trust], i) => (
                  <div key={i} className="card" style={{ padding:"26px 22px", transition:"all .3s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,67,45,.25)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = ""; }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:"var(--coralt)", border:"1px solid rgba(232,67,45,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:23, marginBottom:16 }}>{icon}</div>
                    <h3 className="serif" style={{ fontSize:17, fontWeight:600, marginBottom:8 }}>{title}</h3>
                    <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.65, marginBottom:14 }}>{desc}</p>
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:9, color:"var(--muted2)", textTransform:"uppercase", letterSpacing:1 }}>Confiabilidad</span>
                        <span style={{ fontSize:11, fontWeight:700, color:"var(--green)" }}>{trust}%</span>
                      </div>
                      <div className="trust-bar"><div className="trust-fill" style={{ width:`${trust}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SOCIAL PROOF ── */}
          <section style={{ padding:"72px 28px", borderBottom:"1px solid var(--border)" }}>
            <div className="container">
              <div style={{ textAlign:"center", marginBottom:48 }}>
                <span className="label" style={{ display:"block", marginBottom:12 }}>Testimonios reales ✦</span>
                <h2 className="serif" style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:700, letterSpacing:"-1.5px" }}>Lo que dicen quienes ya viajaron</h2>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
                {[
                  ["🇲🇽","Sofía R.","Ciudad de México","Fui a Plovdiv con el itinerario de noma. Nunca en mi vida había encontrado vuelos a €40 ni sabía que existía esa ciudad. La mejor decisión de mi vida viajera.",4.9,"Plovdiv, Bulgaria"],
                  ["🇨🇴","Carlos M.","Medellín","Planifiqué Tokio con $700 usando el modo mochilero. La IA me encontró cosas que literalmente ningún blog mencionaba. El onigiri de 7-Eleven cambió mi vida.",5.0,"Tokio, Japón"],
                  ["🇦🇷","Valentina L.","Buenos Aires","Fui a Oaxaca siguiendo las joyas ocultas de noma. El palenque de mezcal a $1.50 y Hierve el Agua sin turistas. Increíble lo que te pierdes con los tours normales.",4.8,"Oaxaca, México"],
                  ["🇵🇪","Diego F.","Lima","La IA me preguntó cosas que ningún planificador había preguntado. Qué como, si odio las colas, si viajo solo. El itinerario se sintió hecho para mí, no para un turista genérico.",4.9,"Cartagena, Colombia"],
                ].map(([flag,name,city,text,rating,dest],i) => (
                  <div key={i} className="card" style={{ padding:"22px" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:"var(--s3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{flag}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>{name}</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>{city}</div>
                      </div>
                      <div style={{ marginLeft:"auto", fontSize:13 }}>{"⭐".repeat(Math.floor(rating))}</div>
                    </div>
                    <p style={{ fontSize:13, color:"rgba(237,233,224,.7)", lineHeight:1.7, marginBottom:12, fontStyle:"italic" }}>"{text}"</p>
                    <span className="badge-green" style={{ fontSize:10 }}>✈️ Viajó a {dest}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section style={{ padding:"100px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, background:"radial-gradient(circle,rgba(232,67,45,.06),transparent 65%)", borderRadius:"50%", pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              <h2 className="serif" style={{ fontSize:"clamp(38px,6.5vw,66px)", fontWeight:700, letterSpacing:"-3px", marginBottom:20, lineHeight:1.04 }}>
                Tu vida nómada empieza<br /><span className="coral coral-flow">con una decisión.</span>
              </h2>
              <p style={{ color:"var(--muted)", fontSize:18, marginBottom:48, lineHeight:1.7, maxWidth:500, margin:"0 auto 48px" }}>
                Decide que el mundo es tu casa. noma. te muestra cómo hacerlo posible.
              </p>
              <button className="btn btn-primary" onClick={() => initChat()} style={{ fontSize:17, padding:"21px 54px" }}>
                ✦ Comenzar ahora — es gratis
              </button>
              <p style={{ fontSize:12, color:"var(--muted2)", marginTop:20 }}>Sin tarjeta · Sin registro · En español · Para los que eligieron viajar</p>
            </div>
          </section>

          <footer style={{ borderTop:"1px solid var(--border)", padding:"40px 28px", textAlign:"center" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:30, height:30, background:"linear-gradient(135deg,#E8432D,#C73520)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🌍</div>
              <span className="serif" style={{ fontSize:20, fontWeight:700 }}>noma<span className="coral">.</span></span>
            </div>
            <p style={{ fontSize:12, color:"var(--muted2)" }}>
              El mundo es tu casa. noma. 🌍 · Precios actualizados regularmente · Sin comisiones ocultas<br/>
              <span style={{ fontSize:10, opacity:.6 }}>noma AI puede cometer errores — verifica precios importantes antes de reservar</span>
            </p>
          </footer>
        </div>
      )}

      {/* ═══════════════════════════════════════
          CHAT
      ═══════════════════════════════════════ */}
      {screen === "chat" && (
        <div style={{ paddingTop:"var(--nav)", height:"100vh", display:"flex", flexDirection:"column", maxWidth:900, margin:"0 auto" }} className="chat-section">

          {/* Chat header */}
          <div style={{ padding:"14px 22px", background:"var(--s1)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:13 }}>
              <div style={{ width:42, height:42, borderRadius:13, background:"linear-gradient(135deg,#E8432D,#C73520)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 4px 18px rgba(232,67,45,.3)" }}>✦</div>
              <div>
                <div className="serif" style={{ fontSize:16, fontWeight:700 }}>
                  noma AI {activeDest ? `· ${activeDest.name} ${activeDest.emoji}` : ""}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", display:"inline-block", boxShadow:"0 0 7px var(--green)" }} />
                  <span style={{ fontSize:11, color:"var(--muted)" }}>En línea</span>
                  <BudgetTag mode={budgetMode} />
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {/* Budget quick-switch in chat */}
              <div style={{ display:"flex", gap:3, background:"rgba(255,255,255,.04)", borderRadius:100, padding:"3px", border:"1px solid var(--border)" }}>
                {Object.entries(BUDGET_MODES).map(([k, v]) => (
                  <button key={k} onClick={() => setBudgetMode(k)} title={`${v.label}: ${v.desc}`}
                    style={{ padding:"5px 10px", borderRadius:100, border:"none", cursor:"pointer", fontSize:12, transition:"all .2s", background:budgetMode===k?v.bg:"transparent", color:budgetMode===k?v.color:"var(--muted)", fontWeight:budgetMode===k?700:400 }}>
                    {v.icon}
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setScreen("home")}>🏠</button>
              <button className="btn btn-ghost btn-sm" onClick={() => initChat(activeDest)}>🔄 Reiniciar</button>
              <button className="btn btn-ghost btn-sm" onClick={saveItinerary} style={{marginLeft: 8}}>💾 Guardar</button>
            </div>
          </div>

          {activeDest && <div style={{ padding:"0 22px 12px", flexShrink:0 }}><MapWeather destination={activeDest} />
          <HotelWidget destination={activeDest} budgetMode={budgetMode} /><FlightSearch defaultOrigin="MEX" defaultDest={activeDest.code || "CTG"} /></div>}

          {/* Messages */}
          <div className="scroll" style={{ flex:1, overflowY:"auto", padding:"22px 22px 0" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-wrap ${msg.role==="user"?"user":""}`}>
                <div className={`av ${msg.role==="user"?"av-user":"av-ai"}`}>{msg.role==="user"?"👤":"✦"}</div>
                <div style={{ maxWidth:"80%" }}>
                  <div className={`bubble ${msg.role==="user"?"bubble-user":"bubble-ai"}`}>
                    {msg.role === "assistant"
                      ? msg.content.split("\n").map((line, j) => {
                          if (!line.trim()) return <br key={j} />;
                          return <p key={j} style={{ marginBottom:5 }} dangerouslySetInnerHTML={{ __html:renderMd(line) }} />;
                        })
                      : <p>{msg.content}</p>
                    }
                  </div>
                  {/* Itinerary block below assistant msg */}
                  {msg.hasItinerary && itinerary && i === itineraryMsgIdx && (
                    <ItineraryBlock data={itinerary} onNew={() => { setItinerary(null); setItineraryMsgIdx(null); inputRef.current?.focus(); }} />
                  )}
                </div>
              </div>
            ))}
            {loading && <TypingBubble />}
            <div ref={chatEnd} style={{ height:10 }} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && !loading && (
            <div style={{ padding:"12px 22px 4px", display:"flex", gap:7, flexWrap:"wrap", flexShrink:0 }}>
              {quickReplies.map((q, i) => (
                <button key={i} className="chip" onClick={() => sendMsg(q)}>{q}</button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{ padding:"14px 22px 20px", flexShrink:0, borderTop:"1px solid var(--border)", background:"var(--bg)" }}>
            <div style={{ display:"flex", gap:9, alignItems:"flex-end" }}>
              <textarea ref={inputRef} className="inp" rows={1} placeholder={activeDest ? `Pregúntame sobre ${activeDest.name}... o pide el itinerario completo` : "¿A dónde quieres ir? Cuéntame todo..."}
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,130)+"px"; }}
                onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(input); } }}
                style={{ flex:1, borderRadius:14, maxHeight:130, lineHeight:1.55, overflowY:"auto", fontSize:14 }} />
              <button className="btn btn-primary" onClick={() => sendMsg(input)} disabled={!input.trim()||loading}
                style={{ padding:"13px 18px", borderRadius:14, flexShrink:0, height:50, fontSize:18 }}>
                {loading
                  ? <span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span>
                  : "→"
                }
              </button>
            </div>
            <p style={{ fontSize:11, color:"var(--muted2)", textAlign:"center", marginTop:10 }}>
              noma AI puede cometer errores — verifica precios importantes antes de reservar · <kbd style={{ fontSize:10, padding:"1px 5px", borderRadius:4, border:"1px solid var(--border2)", background:"var(--s2)" }}>Enter</kbd> para enviar · <kbd style={{ fontSize:10, padding:"1px 5px", borderRadius:4, border:"1px solid var(--border2)", background:"var(--s2)" }}>Shift+Enter</kbd> nueva línea
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FLIGHT + EXCHANGE HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function searchFlights(origin, destination, date) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, date })
  });
  return res.json();
}

export async function getExchangeRate(from, to) {
  const res = await fetch(`/api/exchange?from=${from}&to=${to}`);
  return res.json();
}
