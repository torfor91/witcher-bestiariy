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
      // Создаем FormData объект как для обычной HTML формы
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('_subject', `[Ведьмак] ${getCategoryName(formData.category)} от ${formData.name || 'Аноним'}`);
      formDataToSend.append('_format', 'plain');
      formDataToSend.append('_language', 'ru');
      formDataToSend.append('_replyto', formData.email);
      
      // Отправляем на Formspree с вашим Form ID
      const response = await fetch('https://formspree.io/f/mvgebapo', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Успешная отправка
        console.log('✅ Форма успешно отправлена на Formspree');
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '', category: 'bug' });
        
        // Автоматически скрыть сообщение об успехе через 5 секунд
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        // Ошибка Formspree
        const errorData = await response.json();
        console.error('❌ Formspree error:', errorData);
        setError('Ошибка отправки. Попробуйте еще раз.');
      }
    } catch (error) {
      // Сетевая ошибка
      console.error('❌ Network error:', error);
      setError('Проблема с сетью. Проверьте подключение.');
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
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h3 className="text-3xl font-headers text-[#5d4037] mb-4">Сова доставлена!</h3>
            <p className="text-xl font-handwritten text-[#8d6e63] mb-2">
              Твоё послание успешно отправлено через Formspree.
            </p>
            <p className="text-lg font-serif text-[#8d6e63] opacity-80">
              Я получу его и отвечу если оставил совиный адрес.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 px-6 py-2 bg-[#5d4037] text-[#f3e5ab] font-headers rounded hover:bg-[#8d6e63] transition-colors"
            >
              Отправить еще одно послание
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-[#ffebee] border-l-4 border-[#c62828] text-[#c62828] rounded">
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
                <span className="border-b-2 border-[#8d6e63] pb-1">Твоя сова (email)</span>
                <span className="text-lg text-[#8d6e63] ml-2">(необязательно, но для ответа нужно)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="geralt@rivia.witcher"
                className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f]"
              />
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
                rows={6}
                placeholder="Опиши что случилось, что предложить или просто поболтай о ведьмаках..."
                className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f] resize-none"
              />
            </div>

            {/* Honeypot поле (скрытое) для защиты от спама */}
            <div style={{ display: 'none' }}>
              <label>
                Не заполняй это поле:
                <input type="text" name="_gotcha" />
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.message.trim()}
                className={`w-full py-4 font-headers text-2xl font-bold tracking-wider border-2 rounded transition-all duration-300 transform ${
                  isSubmitting || !formData.message.trim()
                    ? 'bg-[#8d6e63] text-[#d7ccc8] cursor-not-allowed opacity-70' 
                    : 'bg-[#5d4037] text-[#f3e5ab] hover:bg-[#8d6e63] hover:text-[#fff8e1] border-[#3e2723] hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-3">⚔️</span>
                    Отправляем сову на Formspree...
                  </span>
                ) : (
                  '✉️ Отправить послание'
                )}
              </button>
              
              <div className="mt-4 p-3 bg-[#fff8e1] rounded border border-[#d7ccc8] text-center">
                <p className="font-handwritten text-lg text-[#8d6e63]">
                  <span className="font-bold">Formspree ID:</span> mvgebapo
                </p>
                <p className="text-sm font-serif text-[#8d6e63] mt-1">
                  Отправляется через Formspree API. Страница не перезагружается.
                </p>
              </div>
            </div>
          </form>
        )}

        <div className="mt-10 pt-6 border-t-2 border-dashed border-[#d7ccc8]">
          <h3 className="font-headers text-2xl text-[#5d4037] mb-4 text-center">Как работает отправка?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#fff8e1] rounded border border-[#d7ccc8] text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-headers text-lg text-[#8a0a0a] mb-2">Заполняешь форму</h4>
              <p className="font-handwritten text-[#5d4037]">Пишешь сообщение на этой странице</p>
            </div>
            <div className="p-4 bg-[#fff8e1] rounded border border-[#d7ccc8] text-center">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-headers text-lg text-[#8a0a0a] mb-2">AJAX отправка</h4>
              <p className="font-handwritten text-[#5d4037]">JavaScript отправляет данные на Formspree</p>
            </div>
            <div className="p-4 bg-[#fff8e1] rounded border border-[#d7ccc8] text-center">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-headers text-lg text-[#8a0a0a] mb-2">Уведомление здесь</h4>
              <p className="font-handwritten text-[#5d4037]">Видишь подтверждение на этой же странице</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="https://formspree.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5d4037] text-[#f3e5ab] font-headers rounded hover:bg-[#8d6e63] transition-colors"
            >
              <span>Powered by Formspree</span>
              <span>⚡</span>
            </a>
            <p className="mt-2 text-sm font-serif text-[#8d6e63]">
              Form ID: <code className="bg-[#fff8e1] px-2 py-1 rounded">mvgebapo</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};