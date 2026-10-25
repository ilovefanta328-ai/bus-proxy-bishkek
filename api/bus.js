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
    // Шаг 1: Сначала делаем GET-запрос на страницу карты, чтобы получить куки сессии
    const pageResponse = await fetch('https://e-meria.kg/transport-map', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Вытаскиваем куки (Set-Cookie) из ответа
    const cookies = pageResponse.headers.get('set-cookie') || '';

    // Шаг 2: Делаем основной запрос за маркерами автобусов, передавая полученные куки
    const response = await fetch('https://e-meria.kg/transport-map/markers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://e-meria.kg/transport-map'
      },
      body: JSON.stringify({ "bus": busNumber, "type": 2 })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка прокси', details: error.message });
  }
          }
                                 
