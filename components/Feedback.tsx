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
      console.log('🔄 Начинаем отправку формы...');
      
      // Создаем URL с параметрами
      const formDataToSend = new URLSearchParams();
      
      // ОСНОВНЫЕ ПОЛЯ
      formDataToSend.append('name', formData.name || 'Аноним');
      formDataToSend.append('message', formData.message);
      formDataToSend.append('category', formData.category);
      
      // EMAIL ПОЛЬЗОВАТЕЛЯ (для ответа)
      if (formData.email) {
        formDataToSend.append('email', formData.email);
        formDataToSend.append('_replyto', formData.email);
      }
      
      // КРИТИЧЕСКИ ВАЖНО: куда Formspree отправит уведомление
      // Это должен быть email, указанный при создании формы в Formspree
      formDataToSend.append('_recipient', 'torfor111@gmail.com');
      
      // Дополнительные параметры
      formDataToSend.append('_subject', `[Ведьмак] Сообщение от ${formData.name || 'Аноним'}`);
      formDataToSend.append('_format', 'plain');
      formDataToSend.append('_language', 'ru');
      
      console.log('📤 Отправляемые данные:');
      console.log('- Form ID: mvgebapo');
      console.log('- Получатель: torfor111@gmail.com');
      console.log('- От кого:', formData.name || 'Аноним');
      console.log('- Email для ответа:', formData.email || 'не указан');
      console.log('- Сообщение:', formData.message.substring(0, 50) + '...');
      
      const response = await fetch('https://formspree.io/f/mvgebapo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formDataToSend.toString()
      });
      
      console.log('📨 Статус ответа:', response.status);
      console.log('📨 Заголовки:', response.headers);
      
      const responseText = await response.text();
      console.log('📨 Текст ответа:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('📨 JSON ответ:', responseData);
      } catch (e) {
        console.error('❌ Ошибка парсинга JSON:', e);
        responseData = { error: 'Invalid JSON response' };
      }
      
      if (response.ok) {
        console.log('✅ УСПЕХ! Форма отправлена на Formspree');
        console.log('📧 Письмо должно прийти на: torfor111@gmail.com');
        console.log('🔍 Проверь: 1) Входящие 2) Спам 3) Promotions (Gmail)');
        
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '', category: 'bug' });
        
        // Показываем сообщение 8 секунд
        setTimeout(() => setIsSubmitted(false), 8000);
      } else {
        const errorMsg = responseData.error || `HTTP ошибка ${response.status}`;
        console.error('❌ ОШИБКА Formspree:', errorMsg);
        setError(`Ошибка Formspree: ${errorMsg}`);
      }
      
    } catch (error: any) {
      console.error('❌ СЕТЕВАЯ ОШИБКА:', error);
      setError(`Сетевая ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestSimpleForm = () => {
    // Простая HTML форма для теста
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formspree.io/f/mvgebapo';
    form.target = '_blank';
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.value = 'test@example.com';
    
    const messageInput = document.createElement('textarea');
    messageInput.name = 'message';
    messageInput.value = 'Тест через простую HTML форму';
    
    const recipientInput = document.createElement('input');
    recipientInput.type = 'hidden';
    recipientInput.name = '_recipient';
    recipientInput.value = 'torfor111@gmail.com';
    
    form.appendChild(emailInput);
    form.appendChild(messageInput);
    form.appendChild(recipientInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    alert('Открываю простую HTML форму для теста. После отправки проверь torfor111@gmail.com');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-headers text-[#e6d5ac] text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#8d6e63] pb-4 inline-block w-full">
        Обратная связь
      </h2>

      <div className="bg-[#f3e5ab] paper-texture shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#8d6e63] p-6 md:p-10 relative overflow-hidden rounded-lg">
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#5d4037] rounded-tr-2xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#5d4037] rounded-bl-2xl opacity-60"></div>

        {isSubmitted ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4 animate-pulse">✅</div>
            <h3 className="text-3xl font-headers text-[#5d4037] mb-4">Форма отправлена!</h3>
            <div className="bg-[#fff8e1] p-4 rounded border border-[#d7ccc8] mb-4">
              <p className="text-xl font-handwritten text-[#8d6e63] mb-2">
                <span className="font-bold">Formspree ID:</span> mvgebapo
              </p>
              <p className="text-lg font-serif text-[#8d6e63]">
                <span className="font-bold">Письмо должно прийти на:</span><br/>
                <code className="text-[#5d4037] bg-[#f3e5ab] px-2 py-1 rounded">torfor111@gmail.com</code>
              </p>
            </div>
            <p className="text-sm text-[#8d6e63] mb-2">
              Проверь: 1) Входящие 2) Спам 3) Promotions (Gmail)
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 px-6 py-2 bg-[#5d4037] text-[#f3e5ab] font-headers rounded hover:bg-[#8d6e63] transition-colors"
            >
              Отправить ещё
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Информация о форме */}
            <div className="p-4 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded">
              <div className="text-center">
                <p className="font-headers text-xl text-[#5d4037] mb-2">Информация о форме</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="font-handwritten text-lg text-[#8d6e63]">
                    <span className="font-bold">Form ID:</span> mvgebapo
                  </div>
                  <div className="font-handwritten text-lg text-[#8d6e63]">
                    <span className="font-bold">Получатель:</span> torfor111@gmail.com
                  </div>
                </div>
                <p className="text-sm text-[#8d6e63] mt-2">
                  После отправки проверь почту <strong>torfor111@gmail.com</strong>
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="font-headers flex items-center gap-2">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-headers text-xl text-[#5d4037]">
                  <span className="border-b-2 border-[#8d6e63] pb-1">Твоё имя</span>
                  <span className="text-sm text-[#8d6e63] ml-2">(необязательно)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Как к тебе обращаться?"
                  className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-headers text-xl text-[#5d4037]">
                  <span className="border-b-2 border-[#8d6e63] pb-1">Твой email</span>
                  <span className="text-sm text-[#8d6e63] ml-2">(для ответа, необязательно)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f]"
                />
                <p className="text-sm text-[#8d6e63] italic">
                  Если оставишь email - смогу тебе ответить
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
                  <option value="bug">📜 Нашёл ошибку</option>
                  <option value="suggestion">💡 Есть идея</option>
                  <option value="creature">🐺 Новое существо</option>
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
                  disabled={isSubmitting}
                  className={`flex-1 py-4 font-headers text-2xl font-bold border-2 rounded transition-all ${
                    isSubmitting
                      ? 'bg-[#8d6e63] text-[#d7ccc8] cursor-not-allowed' 
                      : 'bg-[#5d4037] text-[#f3e5ab] hover:bg-[#8d6e63] hover:text-[#fff8e1] border-[#3e2723] hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-3">⚔️</span>
                      Отправка на Formspree...
                    </span>
                  ) : (
                    '✉️ Отправить форму'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleTestSimpleForm}
                  className="py-4 px-6 font-headers text-xl bg-[#8d6e63] text-[#f3e5ab] border-2 border-[#5d4037] rounded hover:bg-[#a1887f] transition-colors"
                >
                  Тест HTML формы
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-[#fff8e1] border border-[#d7ccc8] rounded text-center">
                <p className="font-handwritten text-lg text-[#8d6e63]">
                  После отправки открой консоль (F12) для деталей
                </p>
                <p className="text-sm text-[#8d6e63] mt-1">
                  И проверь почту <strong>torfor111@gmail.com</strong>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};