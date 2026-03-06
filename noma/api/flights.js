export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { origin, destination, date } = req.body;

  const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${process.env.AMADEUS_KEY}&client_secret=${process.env.AMADEUS_SECRET}`
  });
  const { access_token } = await tokenRes.json();

  const flightsRes = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&max=5&currencyCode=USD`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const data = await flightsRes.json();
  res.status(200).json(data);
}
