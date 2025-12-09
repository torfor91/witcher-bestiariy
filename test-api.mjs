/**
 * Тестовый скрипт для проверки API
 * Запуск: node test-api.mjs
 */

import https from 'https';

// Тестовые ключи (замените на реальные)
const TEST_KEY = 'sk-fb9e87074d1148e4a84a7f06b6cf1170'; // Это пример, он не рабочий

console.log('🔍 Тестирование API ключей...\n');

// 1. Проверка DeepSeek API
console.log('1. Тестируем DeepSeek API:');

const testDeepSeek = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/models',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Статус: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          console.log('   ✅ API доступен');
          resolve(true);
        } else if (res.statusCode === 401) {
          console.log('   ❌ Неверный API ключ');
          resolve(false);
        } else {
          console.log('   ⚠️ Неизвестный ответ:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Ошибка сети:', error.message);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ⏰ Таймаут запроса');
      resolve(false);
    });

    req.end();
  });
};

// 2. Проверка Formspree
console.log('\n2. Тестируем Formspree:');

const testFormspree = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'formspree.io',
      port: 443,
      path: '/f/mvgebapo',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      console.log(`   Статус: ${res.statusCode}`);
      
      if (res.statusCode === 200 || res.statusCode === 405) {
        console.log('   ✅ Форма доступна');
        resolve(true);
      } else {
        console.log('   ❌ Форма недоступна');
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log('   ❌ Ошибка сети:', error.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('   ⏰ Таймаут запроса');
      resolve(false);
    });

    req.end();
  });
};

// 3. Тестовый запрос к чату
console.log('\n3. Тестовый запрос к чат API:');

const testChatAPI = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Привет' }],
      temperature: 0.7,
      max_tokens: 10
    });

    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Статус: ${res.statusCode}`);
        
        try {
          if (res.statusCode === 200) {
            console.log('   ✅ API работает');
            resolve(true);
          } else {
            console.log('   ❌ Ошибка API:', data.substring(0, 200));
            resolve(false);
          }
        } catch (e) {
          console.log('   ❌ Ошибка парсинга ответа');
          console.log('   Сырой ответ:', data.substring(0, 200));
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Ошибка сети:', error.message);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ⏰ Таймаут запроса');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

// Запуск всех тестов
async function runTests() {
  console.log('='.repeat(50));
  console.log('НАЧАЛО ТЕСТИРОВАНИЯ API\n');
  
  const results = {
    deepseek: await testDeepSeek(),
    formspree: await testFormspree(),
    chat: await testChatAPI()
  };

  console.log('\n' + '='.repeat(50));
  console.log('РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:\n');
  
  console.log(`DeepSeek API доступен: ${results.deepseek ? '✅' : '❌'}`);
  console.log(`Formspree форма доступна: ${results.formspree ? '✅' : '❌'}`);
  console.log(`Чат API работает: ${results.chat ? '✅' : '❌'}`);
  
  console.log('\n' + '='.repeat(50));
  console.log('РЕКОМЕНДАЦИИ:');
  
  if (!results.deepseek) {
    console.log('1. Получите API ключ на https://platform.deepseek.com/api_keys');
    console.log('2. Бесплатно: 1000 запросов в месяц');
    console.log('3. Ключ должен начинаться с "sk-"');
  }
  
  if (!results.formspree) {
    console.log('1. Проверьте Formspree ID в форме обратной связи');
    console.log('2. ID должен быть правильным (mvgebapo)');
  }
  
  if (results.deepseek && !results.chat) {
    console.log('1. Проверьте правильность эндпоинта /chat/completions');
    console.log('2. Проверьте структуру запроса (JSON)');
  }
}

runTests().catch(console.error);