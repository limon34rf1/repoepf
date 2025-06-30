// Расписание
const schedule = {
  monday: [
    { time: "09:00-09:30", task: "зарядка", intensity: "normal" },
    { time: "09:30-10:00", task: "завтрак", intensity: "normal" },
    { time: "10:00-12:00", task: "олимпиадная математика, всош, вступительные в лицей", intensity: "hard" },
    { time: "12:15-13:45", task: "дз по математике, всош, ОГЭ математика/физика", intensity: "normal" },
    { time: "13:45-14:30", task: "обед", intensity: "normal" },
    { time: "14:30-16:30", task: "анализ данных и статистика", intensity: "normal" },
    { time: "17:00-18:30", task: "алгоритмы, ML, плюсы/питон", intensity: "hard" },
    { time: "18:30-19:00", task: "тренировка, прогулка, тик-ток", intensity: "normal" },
    { time: "19:00-19:45", task: "ужин, отдых", intensity: "normal" },
    { time: "19:45-21:30", task: "ОГЭ, дз по физике/математике", intensity: "normal" },
    { time: "22:00-23:30", task: "всош индивидуальный, практика анализа данных", intensity: "hard" },
    { time: "23:30-00:00", task: "личная разгрузка", intensity: "normal" },
    { time: "00:00-01:00", task: "сон", intensity: "normal" }
  ],
  // ... аналогично для других дней
};

// Состояния бобра
const beaverStates = {
  study: { 
    image: "/assets/images/beaver-study.png", 
    text: "Учись, как бобр! Сосредоточься на задаче!" 
  },
  eat: { 
    image: "/assets/images/beaver-eat.png", 
    text: "Не забудь подкрепиться! Зарядись энергией!" 
  },
  gym: { 
    image: "/assets/images/beaver-gym.png", 
    text: "Разминайся, как бобр! Движение - жизнь!" 
  },
  sleep: { 
    image: "/assets/images/beaver-sleep.png", 
    text: "Время спать! Отдыхай для новых свершений!" 
  },
  default: { 
    image: "/assets/images/beaver-default.png", 
    text: "Готов к работе! Начни продуктивный день!" 
  }
};

// Элементы DOM
const daysList = document.getElementById('daysList');
const timeline = document.getElementById('timeline');
const beaverContainer = document.getElementById('beaverContainer');
const beaverImage = document.getElementById('beaverImage');
const speechBubble = document.getElementById('speechBubble');

// Текущий день и активный индекс
let currentDay = 'monday';
let activeIndex = 0;

// Дни недели
const days = [
  { id: 'monday', name: 'ПН' },
  { id: 'tuesday', name: 'ВТ' },
  { id: 'wednesday', name: 'СР' },
  { id: 'thursday', name: 'ЧТ' },
  { id: 'friday', name: 'ПТ' },
  { id: 'saturday', name: 'СБ' },
  { id: 'sunday', name: 'ВС' }
];

// Инициализация
function init() {
  renderDays();
  renderTimeline();
  updateBeaver();
  updateTime();
  setInterval(updateTime, 60000); // Обновлять время каждую минуту
  
  // Показать бобра с анимацией
  setTimeout(() => {
    beaverContainer.classList.add('show');
  }, 500);
}

// Рендер дней недели
function renderDays() {
  daysList.innerHTML = days.map(day => `
    <li>
      <button class="day-button ${currentDay === day.id ? 'active' : ''}" 
              data-day="${day.id}">
        ${day.name}
      </button>
    </li>
  `).join('');
  
  // Обработчики кликов
  document.querySelectorAll('.day-button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentDay = btn.dataset.day;
      renderDays();
      renderTimeline();
      updateBeaver();
    });
  });
}

// Рендер таймлайна
function renderTimeline() {
  const blocks = schedule[currentDay];
  timeline.innerHTML = blocks.map((block, index) => `
    <div class="timeline-block ${index < activeIndex ? 'past' : ''} ${index === activeIndex ? 'active' : ''}">
      <div class="time">${block.time}</div>
      <div class="intensity ${block.intensity}">
        ${block.intensity === 'normal' ? '🟡' : 
          block.intensity === 'hard' ? '🔴' : '🟢'}
      </div>
      <div class="task">${block.task}</div>
    </div>
  `).join('');
  
  // Автоскролл к активному блоку
  const activeBlock = timeline.querySelector('.active');
  if (activeBlock) {
    activeBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Обновление бобра
function updateBeaver() {
  const currentTask = schedule[currentDay]?.[activeIndex]?.task;
  let beaverState = 'default';
  
  // Определение состояния бобра
  if (!currentTask) {
    beaverState = 'default';
  } else {
    const task = currentTask.toLowerCase();
    if (task.includes('еда') || task.includes('завтрак') || task.includes('обед') || task.includes('ужин')) {
      beaverState = 'eat';
    } else if (task.includes('тренировка') || task.includes('зарядка') || task.includes('прогулка')) {
      beaverState = 'gym';
    } else if (task.includes('сон') || task.includes('отдых') || task.includes('разгрузка')) {
      beaverState = 'sleep';
    } else if (task.includes('математика') || task.includes('анализ') || task.includes('python') || 
               task.includes('физика') || task.includes('статистика') || task.includes('алгоритмы') ||
               task.includes('олимпиад') || task.includes('практика') || task.includes('проект')) {
      beaverState = 'study';
    }
  }
  
  // Установка ночного режима (00:00-06:00)
  const now = new Date();
  const hours = now.getHours();
  if (hours >= 0 && hours < 6) {
    beaverState = 'sleep';
  }
  
  // Обновление бобра
  beaverImage.src = beaverStates[beaverState].image;
  speechBubble.textContent = beaverStates[beaverState].text;
}

// Обновление времени и активного блока
function updateTime() {
  const now = new Date();
  const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
  
  // Установка текущего дня
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayOfWeek = days[moscowTime.getDay()];
  
  // Если автоматический режим (не выбрано вручную)
  if (!document.querySelector(`.day-button[data-day="${currentDay}"]`).classList.contains('active')) {
    currentDay = currentDayOfWeek;
    renderDays();
  }
  
  // Поиск активного блока
  const currentHour = moscowTime.getHours();
  const currentMinute = moscowTime.getMinutes();
  const currentBlocks = schedule[currentDay];
  
  for (let i = 0; i < currentBlocks.length; i++) {
    const [start, end] = currentBlocks[i].time.split('-').map(t => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    });
    
    if (currentHour + currentMinute/60 < end) {
      if (activeIndex !== i) {
        activeIndex = i;
        renderTimeline();
        updateBeaver();
      }
      break;
    }
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);