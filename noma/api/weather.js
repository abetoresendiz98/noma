export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { lat, lon, cnt } = req.query;
  const endpoint = cnt ? 'forecast' : 'weather';
  const url = `https://api.openweathermap.org/data/2.5/${endpoint}?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}&units=metric&lang=es${cnt ? `&cnt=${cnt}` : ''}`;
  const r = await fetch(url);
  const data = await r.json();
  res.status(200).json(data);
}
