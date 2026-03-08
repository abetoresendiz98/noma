export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { location, checkIn, checkOut, adults } = req.query;

  try {
    // CAMBIO: locale=es_US
    const regionRes = await fetch(
      `https://hotels-com-provider.p.rapidapi.com/v2/regions?query=${encodeURIComponent(location)}&domain=US&locale=es_US`,
      { headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }}
    );
    const regionData = await regionRes.json();
    
    const regionId = regionData?.data?.[0]?.gaiaId || regionData?.data?.[0]?.id;
    if (!regionId) return res.status(200).json({ debug: regionData, hotels: [] });

    // CAMBIO: locale=es_US
    const hotelsRes = await fetch(
      `https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=${regionId}&locale=es_US&checkin_date=${checkIn}&checkout_date=${checkOut}&adults_number=${adults||2}&sort_order=REVIEW&domain=US&available_filter=SHOW_AVAILABLE_ONLY`,
      { headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }}
    );
    const hotelsData = await hotelsRes.json();
    res.status(200).json(hotelsData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
