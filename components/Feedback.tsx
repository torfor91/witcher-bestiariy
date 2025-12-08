import React, { useState } from 'react';

export const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: 'bug'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.message.trim()) {
      setError('Послание не может быть пустым');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // ДЕБАГ: Логируем данные
      console.log('📤 Отправляемые данные:', formData);
      
      // Создаем FormData
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email || 'no-email@example.com');
      formDataToSend.append('message', formData.message);
      formDataToSend.append('name', formData.name || 'Аноним');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('_subject', `[Ведьмак] ${getCategoryName(formData.category)} от ${formData.name || 'Аноним'}`);
      
      // ДЕБАГ: Проверяем FormData
      console.log('📦 FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Отправляем на Formspree
      const response = await fetch('https://formspree.io/f/mvgebapo', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('📨 Response text:', responseText);
      
      try {
        const responseData = JSON.parse(responseText);
        console.log('📨 Response JSON:', responseData);
        
        if (response.ok) {
          console.log('✅ УСПЕХ: Форма отправлена на Formspree');
          setIsSubmitted(true);
          setFormData({ name: '', email: '', message: '', category: 'bug' });
          
          setTimeout(() => setIsSubmitted(false), 5000);
        } else {
          console.error('❌ ОШИБКА Formspree:', responseData);
          setError(`Ошибка Formspree: ${responseData.error || 'Неизвестная ошибка'}`);
        }
      } catch (jsonError) {
        console.error('❌ ОШИБКА парсинга JSON:', jsonError, 'Raw:', responseText);
        setError('Неверный ответ от сервера');
      }
    } catch (error: any) {
      console.error('❌ СЕТЕВАЯ ОШИБКА:', error);
      setError(`Сетевая ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'bug': return 'Баг/Ошибка';
      case 'suggestion': return 'Предложение';
      case 'creature': return 'Новое существо';
      case 'other': return 'Прочее';
      default: return 'Сообщение';
    }
  };

  const handleTestEmail = () => {
    console.log('🧪 Тестовый email:', formData.email);
    console.log('🧪 Сообщение:', formData.message);
    alert(`Тестовый email: ${formData.email}\nСообщение: ${formData.message}`);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-headers text-[#e6d5ac] text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#8d6e63] pb-4 inline-block w-full">
        Обратная связь
      </h2>

      <div className="bg-[#f3e5ab] paper-texture shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#8d6e63] p-6 md:p-10 relative overflow-hidden rounded-lg">
        {/* Декоративные уголки */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#5d4037] rounded-tr-2xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#5d4037] rounded-bl-2xl opacity-60"></div>

        {isSubmitted ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-3xl font-headers text-[#5d4037] mb-4">Сова доставлена!</h3>
            <p className="text-xl font-handwritten text-[#8d6e63] mb-2">
              Послание отправлено через Formspree.
            </p>
            <p className="text-lg font-serif text-[#8d6e63] opacity-80 mb-6">
              Проверь консоль браузера для деталей.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2 bg-[#5d4037] text-[#f3e5ab] font-headers rounded hover:bg-[#8d6e63] transition-colors"
            >
              Отправить ещё
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <div className="font-headers flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block font-headers text-xl text-[#5d4037]">
                  <span className="border-b-2 border-[#8d6e63] pb-1">Твоё имя</span>
                  <span className="text-lg text-[#8d6e63] ml-2">(необязательно)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Геральт, Цири, Йеннифер..."
                  className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-headers text-xl text-[#5d4037]">
                  <span className="border-b-2 border-[#8d6e63] pb-1">Email для ответа</span>
                  <span className="text-lg text-[#8d6e63] ml-2">(необязательно)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f]"
                />
                <p className="text-sm text-[#8d6e63] italic">
                  Если хочешь получить ответ, укажи настоящий email
                </p>
              </div>

              <div className="space-y-2">
                <label className="block font-headers text-xl text-[#5d4037]">
                  <span className="border-b-2 border-[#8d6e63] pb-1">Тип послания</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-headers text-lg text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="bug">📜 Нашёл баг/ошибку</option>
                  <option value="suggestion">💡 Есть идея для улучшения</option>
                  <option value="creature">🐺 Хочу новое существо в бестиарий</option>
                  <option value="other">⚔️ Прочее</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-headers text-xl text-[#5d4037]">
                  <span className="border-b-2 border-[#8d6e63] pb-1">Текст послания *</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Что у тебя на душе, странник?..."
                  className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.message.trim()}
                  className={`flex-1 py-4 font-headers text-2xl font-bold tracking-wider border-2 rounded transition-all duration-300 ${
                    isSubmitting || !formData.message.trim()
                      ? 'bg-[#8d6e63] text-[#d7ccc8] cursor-not-allowed opacity-70' 
                      : 'bg-[#5d4037] text-[#f3e5ab] hover:bg-[#8d6e63] hover:text-[#fff8e1] border-[#3e2723] hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-3">⚔️</span>
                      Отправка...
                    </span>
                  ) : (
                    'Отправить через Formspree'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleTestEmail}
                  className="py-4 px-6 font-headers text-xl bg-[#8d6e63] text-[#f3e5ab] border-2 border-[#5d4037] rounded hover:bg-[#a1887f] transition-colors"
                >
                  Тест данных
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-[#fff8e1] rounded border border-[#d7ccc8]">
                <p className="text-center font-handwritten text-lg text-[#8d6e63]">
                  <span className="font-bold">Formspree ID:</span> mvgebapo
                </p>
                <p className="text-center text-sm text-[#8d6e63] mt-1">
                  Открой консоль браузера (F12) для отладки
                </p>
              </div>
            </form>

            {/* Убрали нижнюю часть "Как работает отправка?" */}
          </>
        )}
      </div>
    </div>
  );
};