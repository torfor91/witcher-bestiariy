import { ChatMessage } from '../types';

// Конфигурация DeepSeek API
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// Тип для чат-сессии
interface DeepSeekSession {
  creatureId: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  lastUpdated: number;
}

// Кэш сессий по ID существа
const chatSessions = new Map<string, DeepSeekSession>();

// Промпт для Геральта (бестиарий)
export const SYSTEM_PROMPT_GERALT_NOTES = `Ты — Геральт из Ривии, ведьмак школы Волка. Ты делаешь заметки на полях своего бестиария.
Пользователь — ученик ведьмака или читатель, который задаёт вопросы о конкретном монстре.

Твоя задача:
1. Дай чёткий, практический совет по уничтожению этой твари
2. Расскажи о её повадках, слабостях и особенностях
3. Поделись личным опытом встречи с этим существом
4. Говори как настоящий ведьмак: цинично, с сарказмом, но с заботой об ученике
5. Используй сленг ведьмака: "кроны", "знаки", "масла", "бомбы", "зелья"
6. Отвечай от первого лица, как будто пишешь пером на бумаге
7. Не используй мат, но можешь использовать "проклятье", "черт", "холера"

Твой стиль:
- "Серебряный для чудовищ, стальной для людей... но для этой твари нужно кое-что ещё."
- "Если увидишь это — беги или готовься драться."
- "Из моего опыта: лучше перестраховаться."
- Кратко, по делу, но с историями из прошлого.`;

// Промпт для доски заказов
export const SYSTEM_PROMPT_GERALT_BOARD = `Ты — Геральт из Ривии, стоишь у доски объявлений.
Пользователь — кмет, горожанин или староста, который хочет повесить заказ или обсудить существующий.

Твоя задача:
1. Выясни детали заказа (кого убить, где видели, какая награда)
2. Торгуйся, если цена слишком мала (но в меру)
3. Принимай заказ, если условия подходят
4. Давай практические советы по выполнению контракта

Твой стиль:
- Циничный, прямой, профессиональный
- Используй сленг: "кроны", "новоградские орены", "утопцы", "трупоеды"
- Не используй мат, но можешь использовать "зараза", "холера", "проклятье"
- Отвечай на каждый вопрос развернуто, если это касается дела
- Если спрашивают глупость — ответь с сарказмом

Пример диалога:
Пользователь: "У нас в подвале кто-то скребется."
Геральт: "Скребется? Это может быть что угодно, от крыс до фледера. Если это фледер, то с вас сто крон, не меньше. Ведите, показывайте."`;

/**
 * Создает или возвращает существующую чат-сессию
 */
export const getChatSession = (
  creatureId: string, 
  context: 'notes' | 'board' = 'notes',
  creatureInfo?: { name: string; className: string; weaknesses: string[]; description: string }
): DeepSeekSession => {
  // Очищаем старые сессии (старше 3 часов)
  const now = Date.now();
  for (const [key, session] of chatSessions.entries()) {
    if (now - session.lastUpdated > 3 * 60 * 60 * 1000) {
      chatSessions.delete(key);
    }
  }
  
  let session = chatSessions.get(creatureId);
  
  if (!session) {
    // Определяем системный промпт в зависимости от контекста
    let systemPrompt = SYSTEM_PROMPT_GERALT_NOTES;
    
    if (context === 'notes' && creatureInfo) {
      systemPrompt = `${SYSTEM_PROMPT_GERALT_NOTES}\n\nТЕКУЩАЯ ТВАРЬ:\nИмя: ${creatureInfo.name}\nКласс: ${creatureInfo.className}\nСлабости: ${creatureInfo.weaknesses.join(', ')}\nОписание: ${creatureInfo.description}\n\nОтвечай именно об этой твари!`;
    } else if (context === 'board') {
      systemPrompt = SYSTEM_PROMPT_GERALT_BOARD;
    }
    
    // Создаем новую сессию
    session = {
      creatureId,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'assistant',
          content: context === 'notes' 
            ? `Заинтересовал ${creatureInfo?.name.toLowerCase() || 'этот монстр'}? Спрашивай, пока я добрый. У меня есть пара историй про эту тварь.`
            : "Подходи, не бойся. Читай, что написано. Ищешь работы или хочешь, чтобы я кого-то убил? Пиши своё объявление."
        }
      ],
      lastUpdated: now
    };
    
    chatSessions.set(creatureId, session);
  }
  
  return session;
};

/**
 * Отправляет сообщение через DeepSeek API
 */
export const sendMessageToGeralt = async (
  sessionId: string,
  userMessage: string,
  context: 'notes' | 'board' = 'notes',
  creatureInfo?: { name: string; className: string; weaknesses: string[]; description: string }
): Promise<string> => {
  // Проверка API ключа
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'ваш_ключ_здесь') {
    console.error('❌ DeepSeek API ключ не настроен!');
    return getFallbackResponse(userMessage, context, creatureInfo?.name);
  }
  
  // Получаем сессию
  const session = getChatSession(sessionId, context, creatureInfo);
  
  try {
    // Добавляем сообщение пользователя в историю
    session.messages.push({
      role: 'user',
      content: userMessage
    });
    
    console.log(`📤 Отправка к DeepSeek (${context}):`, {
      keyLength: DEEPSEEK_API_KEY.length,
      messages: session.messages.length,
      lastMessage: userMessage.substring(0, 50) + '...'
    });
    
    // Отправляем запрос к DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Основная модель
        // model: 'deepseek-reasoner', // Для более сложных рассуждений (платно)
        messages: session.messages.slice(-8), // Берем последние 8 сообщений
        temperature: 0.85,
        max_tokens: 600,
        stream: false,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });
    
    console.log('📨 Статус:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Ошибка API:', response.status, errorData);
      
      // Удаляем последнее сообщение пользователя (оно не было обработано)
      session.messages.pop();
      
      // Обработка ошибок
      if (response.status === 401) {
        return "Проклятье! Неверный ключ от портала. Проверь настройки API.";
      }
      if (response.status === 429) {
        return "Хм... Лимит историй на сегодня исчерпан. Приходи завтра.";
      }
      if (response.status === 400) {
        return "Что-то не так с твоим вопросом. Спроси по-другому.";
      }
      
      return "Медальон дрожит... Магия глушит связь. Попробуй позже.";
    }
    
    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('Пустой ответ от API');
    }
    
    // Добавляем ответ ассистента в историю
    session.messages.push({
      role: 'assistant',
      content: assistantMessage
    });
    
    // Обновляем время сессии
    session.lastUpdated = Date.now();
    chatSessions.set(sessionId, session);
    
    console.log('✅ Ответ получен:', assistantMessage.substring(0, 100) + '...');
    return assistantMessage;
    
  } catch (error: any) {
    console.error('❌ Ошибка при запросе:', error);
    
    // Удаляем необработанное сообщение пользователя
    if (session.messages[session.messages.length - 1]?.role === 'user') {
      session.messages.pop();
    }
    
    return getFallbackResponse(userMessage, context, creatureInfo?.name);
  }
};

/**
 * Запасные ответы на случай проблем с API
 */
const getFallbackResponse = (
  userMessage: string, 
  context: 'notes' | 'board',
  creatureName?: string
): string => {
  const message = userMessage.toLowerCase();
  
  if (context === 'notes') {
    const notesFallbacks = [
      `Портал снова барахлит... Но про ${creatureName || 'эту тварь'}: серебро и Игни работают всегда.`,
      "Медальон дрожит. Пока связь не восстановилась: изучай повадки, готовь зелья, не лезь без нужды.",
      "Хм... Не могу ответить сейчас. Запомни: у каждой твари есть ритм. Нарушь его — победишь.",
      "Связь прервана. Из опыта: правильные бомбы важнее грубой силы.",
      `Про ${creatureName || 'таких'}: терпение и наблюдательность спасут тебя лучше любого меча.`
    ];
    
    if (message.includes('как убить') || message.includes('способ')) return notesFallbacks[0];
    if (message.includes('слаб') || message.includes('уязвим')) return notesFallbacks[1];
    if (message.includes('опасн') || message.includes('страш')) return notesFallbacks[2];
    if (message.includes('совет') || message.includes('что делать')) return notesFallbacks[3];
    
    return notesFallbacks[Math.floor(Math.random() * notesFallbacks.length)];
  }
  
  // Fallback для доски заказов
  const boardFallbacks = [
    "Черт... Доска сегодня не работает. Оставь записку, вернусь — посмотрю.",
    "Не могу прочитать сейчас. Но стандартная цена: 100 крон за простого монстра, 300 — за реликта.",
    "Хм... Магия доски спит. Опиши проблему подробно: где, когда, сколько платишь.",
    "Связь с доской потеряна. Но совет: всегда договаривайся о цене до начала работы.",
    "Пока доска не отвечает. Помни: опасный контракт должен оплачиваться втройне."
  ];
  
  if (message.includes('цена') || message.includes('сколько')) return boardFallbacks[1];
  if (message.includes('где') || message.includes('когда')) return boardFallbacks[2];
  if (message.includes('опасн') || message.includes('сложн')) return boardFallbacks[4];
  
  return boardFallbacks[Math.floor(Math.random() * boardFallbacks.length)];
};

/**
 * Очищает все сессии
 */
export const clearAllSessions = (): void => {
  chatSessions.clear();
  console.log('🧹 Все сессии DeepSeek очищены');
};

/**
 * Получает историю сообщений для отладки
 */
export const getSessionHistory = (sessionId: string): ChatMessage[] => {
  const session = chatSessions.get(sessionId);
  if (!session) return [];
  
  return session.messages
    .filter(msg => msg.role !== 'system')
    .map((msg, index) => ({
      id: `hist-${index}`,
      role: msg.role === 'assistant' ? 'model' : 'user',
      text: msg.content
    }));
};