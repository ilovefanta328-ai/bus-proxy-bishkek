export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const busNumber = req.query.bus || '37';

  try {
    const response = await fetch('https://e-meria.kg/transport-map/markers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://e-meria.kg/transport-map',
        'Origin': 'https://e-meria.kg'
      },
      body: `bus=${encodeURIComponent(busNumber)}&type=2`
    });

    const text = await response.text();
    
    // Пробуем распарсить как JSON, а если там ошибка — отдаем текст, чтобы увидеть причину
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({ error: "Не JSON ответ", raw: text });
    }

  } catch (error) {
    res.status(500).json({ error: 'Ошибка прокси', details: error.message });
  }
}

