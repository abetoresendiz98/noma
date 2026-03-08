export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { location, checkIn, checkOut } = req.query;
  const ci = checkIn || '2026-04-15';
  const co = checkOut || '2026-04-20';
  
  try {
    const url = `https://serpapi.com/search.json?engine=google_hotels&q=${encodeURIComponent(location)}&check_in_date=${ci}&check_out_date=${co}&adults=2&currency=USD&api_key=${process.env.SERPAPI_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    
    const hotels = (data.properties || []).slice(0, 8).map(h => ({
      id: h.property_token || h.name,
      name: h.name,
      rating: h.overall_rating || h.rating,
      reviews: h.reviews || 0,
      price: h.rate_per_night?.extracted_lowest || h.rate_per_night?.lowest,
      total: h.total_rate?.extracted_lowest,
      image: h.images?.[0]?.thumbnail,
      link: h.link || `https://www.google.com/travel/hotels/entity/${h.property_token}`
    }));

    res.status(200).json({ hotels, count: hotels.length });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
