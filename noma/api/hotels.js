export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { location, checkIn, checkOut, adults } = req.query;
  try {
    const regionRes = await fetch(
      'https://hotels-com-provider.p.rapidapi.com/v2/regions?query=' + encodeURIComponent(location) + '&domain=US&locale=en_US',
      { headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }}
    );
    const regionData = await regionRes.json();
    const regionId = regionData?.data?.[0]?.gaiaId;
    if (!regionId) return res.status(200).json({ data: { propertySearch: { properties: [] } } });

    const hotelsRes = await fetch(
      'https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=' + regionId + '&locale=en_US&checkin_date=' + checkIn + '&checkout_date=' + checkOut + '&adults_number=' + (adults||2) + '&sort_order=REVIEW&domain=US&available_filter=SHOW_AVAILABLE_ONLY',
      { headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }}
    );
    const data = await hotelsRes.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
