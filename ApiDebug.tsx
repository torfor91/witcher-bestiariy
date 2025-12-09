import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../services/deepseekService';

export const ApiDebug: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'valid' | 'invalid' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkApi();
  }, []);

  const checkApi = async () => {
    setApiStatus('checking');
    setMessage('Проверка API ключа...');
    
    try {
      const isValid = await validateApiKey();
      
      if (isValid) {
        setApiStatus('valid');
        setMessage('✅ API ключ действителен! Геральт готов к разговору.');
      } else {
        setApiStatus('invalid');
        setMessage('❌ API ключ недействителен. Проверьте файл .env');
      }
    } catch (error) {
      setApiStatus('error');
      setMessage(`❌ Ошибка: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'valid': return 'text-green-600';
      case 'invalid': return 'text-red-600';
      case 'error': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🔧 Отладка API</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Текущий статус:</h3>
        <div className={`p-4 rounded border ${getStatusColor()} border-current`}>
          <p className="font-mono">{message}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Информация:</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p><strong>Переменная окружения:</strong> VITE_DEEPSEEK_API_KEY</p>
          <p><strong>Файл:</strong> .env в корне проекта</p>
          <p><strong>Формат:</strong> VITE_DEEPSEEK_API_KEY=sk-ваш_ключ</p>
        </div>
      </div>
      
      <button
        onClick={checkApi}
        disabled={apiStatus === 'checking'}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {apiStatus === 'checking' ? 'Проверка...' : 'Проверить снова'}
      </button>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>💡 Если ключ не работает:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Проверьте, что файл .env существует в корне проекта</li>
          <li>Перезапустите сервер разработки: <code>npm run dev</code></li>
          <li>Проверьте ключ на <a href="https://platform.deepseek.com/api_keys" className="text-blue-500 underline">платформе DeepSeek</a></li>
          <li>Убедитесь, что ключ начинается с "sk-"</li>
        </ol>
      </div>
    </div>
  );
};