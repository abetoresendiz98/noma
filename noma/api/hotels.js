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
    return res.status(200).json({ debug_region: regionData });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
