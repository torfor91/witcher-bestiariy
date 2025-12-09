import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Прокси для DeepSeek API
app.post('/api/deepseek/chat', async (req, res) => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API ключ не настроен на сервере' });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Ошибка прокси-сервера' });
  }
});

// Проверка API ключа
app.get('/api/deepseek/check', async (req, res) => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return res.json({ valid: false, message: 'API ключ не настроен' });
    }

    const response = await fetch('https://api.deepseek.com/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    res.json({
      valid: response.ok,
      status: response.status,
      message: response.ok ? 'API ключ действителен' : 'API ключ недействителен'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Прокси-сервер запущен на http://localhost:${PORT}`);
});