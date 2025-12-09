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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      alert('Пожалуйста, напишите сообщение');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Основные данные
      formDataToSend.append('name', formData.name || 'Аноним');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('message', formData.message);
      formDataToSend.append('category', formData.category);
      
      // Параметры Formspree
      if (formData.email) {
        formDataToSend.append('_replyto', formData.email);
      }
      formDataToSend.append('_subject', `Witcher Bestiary: ${getCategoryName(formData.category)}`);
      formDataToSend.append('_format', 'plain');
      formDataToSend.append('_language', 'ru');
      
      // Отправка на Formspree
      const response = await fetch('https://formspree.io/f/mvgebapo', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Успешная отправка
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '', category: 'bug' });
      } else {
        // Ошибка
        alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
      }
    } catch (error) {
      // Сетевая ошибка
      alert('Проблема с подключением. Проверьте интернет и попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (category: string): string => {
    const categories = {
      bug: 'Сообщение об ошибке',
      suggestion: 'Предложение',
      creature: 'Новое существо',
      other: 'Другое'
    };
    return categories[category as keyof typeof categories] || 'Сообщение';
  };

  // Если форма отправлена - показываем подтверждение
  if (isSubmitted) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-headers text-[#e6d5ac] text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#8d6e63] pb-4">
          Обратная связь
        </h2>

        <div className="bg-[#f3e5ab] paper-texture shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#8d6e63] p-8 md:p-12 rounded-lg text-center">
          <div className="text-6xl mb-6">✅</div>
          <h3 className="text-3xl font-headers text-[#5d4037] mb-4">
            Сообщение отправлено!
          </h3>
          <p className="text-xl font-handwritten text-[#8d6e63] mb-6">
            Спасибо за ваше сообщение. Я свяжусь с вами в ближайшее время.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-3 bg-[#5d4037] text-[#f3e5ab] font-headers text-xl rounded-lg hover:bg-[#8d6e63] transition-colors"
          >
            Отправить новое сообщение
          </button>
        </div>
      </div>
    );
  }

  // Основная форма
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-headers text-[#e6d5ac] text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#8d6e63] pb-4">
        Обратная связь
      </h2>

      <div className="bg-[#f3e5ab] paper-texture shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#8d6e63] p-6 md:p-10 rounded-lg">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#5d4037] rounded-tr-2xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#5d4037] rounded-bl-2xl opacity-60"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Имя */}
          <div className="space-y-2">
            <label className="block font-headers text-xl text-[#5d4037]">
              <span className="border-b-2 border-[#8d6e63] pb-1">Ваше имя</span>
              <span className="text-sm text-[#8d6e63] ml-2">(необязательно)</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Как к вам обращаться?"
              className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block font-headers text-xl text-[#5d4037]">
              <span className="border-b-2 border-[#8d6e63] pb-1">Email для ответа</span>
              <span className="text-sm text-[#8d6e63] ml-2">(необязательно)</span>
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
              Если оставите email - смогу вам ответить
            </p>
          </div>

          {/* Тип сообщения */}
          <div className="space-y-2">
            <label className="block font-headers text-xl text-[#5d4037]">
              <span className="border-b-2 border-[#8d6e63] pb-1">Тип сообщения</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-headers text-lg text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="bug">📜 Сообщить об ошибке</option>
              <option value="suggestion">💡 Предложить улучшение</option>
              <option value="creature">🐺 Предложить новое существо</option>
              <option value="other">⚔️ Другое</option>
            </select>
          </div>

          {/* Сообщение */}
          <div className="space-y-2">
            <label className="block font-headers text-xl text-[#5d4037]">
              <span className="border-b-2 border-[#8d6e63] pb-1">Ваше сообщение *</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Опишите вашу идею, проблему или предложение..."
              className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-handwritten text-xl text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors placeholder-[#a1887f] resize-none"
            />
            <p className="text-sm text-[#8d6e63]">
              * Поле обязательно для заполнения
            </p>
          </div>

          {/* Кнопка отправки */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-headers text-2xl font-bold border-2 rounded transition-colors ${
                isSubmitting
                  ? 'bg-[#8d6e63] text-[#d7ccc8] cursor-not-allowed'
                  : 'bg-[#5d4037] text-[#f3e5ab] hover:bg-[#8d6e63] border-[#3e2723]'
              }`}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
            </button>
            
            <p className="mt-4 text-center text-[#8d6e63] font-handwritten text-lg">
              Сообщение будет отправлено через Formspree
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};