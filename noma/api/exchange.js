export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { from, to } = req.query;
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.VITE_EXCHANGE_KEY}/pair/${from}/${to}`
  );
  const data = await response.json();
  res.status(200).json(data);
}
