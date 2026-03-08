export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { location, checkIn, checkOut, adults } = req.query;

  try {
    const regionRes = await fetch(
      `https://hotels-com-provider.p.rapidapi.com/v2/regions?query=${encodeURIComponent(location)}&domain=US&locale=es_MX`,
      { headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }}
    );
    const regionData = await regionRes.json();
    console.log('Regions:', JSON.stringify(regionData).slice(0,500));
    
    const regionId = regionData?.data?.[0]?.gaiaId || regionData?.data?.[0]?.id;
    if (!regionId) return res.status(200).json({ debug: regionData, hotels: [] });

    const hotelsRes = await fetch(
      `https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=${regionId}&locale=es_MX&checkin_date=${checkIn}&checkout_date=${checkOut}&adults_number=${adults||2}&sort_order=REVIEW&domain=US&available_filter=SHOW_AVAILABLE_ONLY`,
      { headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }}
    );
    const hotelsData = await hotelsRes.json();
    console.log('Hotels:', JSON.stringify(hotelsData).slice(0,500));
    res.status(200).json(hotelsData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
