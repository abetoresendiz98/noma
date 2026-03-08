export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { location, checkIn, checkOut, adults } = req.query;
  try {
    const regionRes = await fetch(
      'https://hotels-com-provider.p.rapidapi.com/v2/regions?query=' + encodeURIComponent(location) + '&domain=US&locale=en_US',
      { headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com' }}
    );
    const regionData = await regionRes.json();
    const region = regionData?.data?.find(r => r.type === 'CITY' || r.type === 'NEIGHBORHOOD' || r.type === 'AIRPORT') || regionData?.data?.[0];
    const regionId = region?.gaiaId;
    if (!regionId) return res.status(200).json({ hotels: [], debug: 'no region', raw: regionData });

    const ci = checkIn || '2026-04-06';
    const co = checkOut || '2026-04-11';
    const url = `https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=${regionId}&locale=en_US&checkin_date=${ci}&checkout_date=${co}&adults_number=${adults||2}&sort_order=REVIEW&domain=US&available_filter=SHOW_AVAILABLE_ONLY`;
    const hotelsRes = await fetch(url, {
      headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com' }
    });
    const raw = await hotelsRes.json();

    const list = raw?.data?.propertySearch?.properties
      || raw?.properties
      || raw?.data?.properties
      || [];

    const nights = Math.round((new Date(co) - new Date(ci)) / 86400000) || 1;

    const hotels = list.slice(0, 12).map(h => ({
      id: h.id,
      name: h.name,
      stars: h.star || 0,
      rating: h.reviews?.score || null,
      reviews: h.reviews?.total || 0,
      price: h.price?.lead?.amount || null,
      currency: h.price?.lead?.currencyInfo?.code || 'USD',
      total: h.price?.lead?.amount ? Math.round(h.price.lead.amount * nights) : null,
      image: h.propertyImage?.image?.url || null,
      link: `https://www.hotels.com/h${h.id}.Hotel-Information`
    }));

    res.status(200).json({ hotels, debug_count: list.length, raw_keys: Object.keys(raw) });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
