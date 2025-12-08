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
      alert('Послание не может быть пустым');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email || 'torfor111@gmail.com');
      formDataToSend.append('message', formData.message);
      formDataToSend.append('name', formData.name || 'Аноним');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('_subject', `[Ведьмак] ${formData.category === 'bug' ? 'Баг' : 'Сообщение'} от ${formData.name || 'Аноним'}`);
      
      const response = await fetch('https://formspree.io/f/mvgebapo', {
        method: 'POST',
        body: formDataToSend,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '', category: 'bug' });
      } else {
        alert('Ошибка отправки. Попробуйте ещё раз.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Проблема с сетью. Проверьте подключение.');
    } finally {
      setIsSubmitting(false);
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-bounce">🦉</div>
            <h3 className="text-3xl font-headers text-[#5d4037] mb-4">Сова доставлена!</h3>
            <p className="text-xl font-handwritten text-[#8d6e63] mb-6">
              Твоё послание отправлено через Formspree.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2 bg-[#5d4037] text-[#f3e5ab] font-headers rounded hover:bg-[#8d6e63] transition-colors"
            >
              Отправить ещё одно послание
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-headers text-xl text-[#5d4037]">
                <span className="border-b-2 border-[#8d6e63] pb-1">Твоё имя</span>
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
                <span className="border-b-2 border-[#8d6e63] pb-1">Email для ответа</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Если хочешь получить ответ"
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
                className="w-full px-4 py-3 bg-[#fff8e1] border-2 border-[#d7ccc8] rounded font-headers text-lg text-[#3e2723] focus:border-[#8d6e63] focus:outline-none transition-colors appearance-none"
              >
                <option value="bug">📜 Нашёл ошибку</option>
                <option value="suggestion">💡 Есть идея</option>
                <option value="creature">🐺 Новое существо</option>
                <option value="other">⚔️ Прочее</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-headers text-xl text-[#5d4037]">
                <span className="border-b-2 border-[#8d6e63] pb-1">Текст послания</span>
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

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 font-headers text-2xl font-bold bg-[#5d4037] text-[#f3e5ab] hover:bg-[#8d6e63] border-2 border-[#3e2723] rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить послание'}
              </button>
              
              <p className="mt-4 text-center text-[#8d6e63] font-handwritten">
                Форма работает через Formspree
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};