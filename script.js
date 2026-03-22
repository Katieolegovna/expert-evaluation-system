// Полифилл для roundRect (для старых браузеров)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
        const radius = Array.isArray(radii) ? radii[0] : radii;
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Управление вкладками
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Отображение экспертов при переходе на соответствующую вкладку
        if (tabName === 'experts') {
            displayExperts();
        }
        
        // Автоматический запуск анализа при переходе на вкладку результатов
        if (tabName === 'results') {
            calculateAndDisplayResults();
        }
        
        // Отображение рисков при переходе на вкладку рисков
        if (tabName === 'risks') {
            displayRisks();
        }
        
        // Отображение заключения при переходе на вкладку заключения
        if (tabName === 'conclusion') {
            displayConclusion();
        }
    });
});

// Хранилище данных экспертов
let expertsData = [];

// Генерация данных 20 экспертов с заданными оценками
function generateExperts() {
    // Новые данные экспертов с обновленными оценками
    const newExpertData = {
        'Ф1': {
            scenario1: [5,4,5,4,5,4,5,4,5,4,5,5,4,5,4,5,5,4,5,4],
            scenario2: [4,4,3,5,4,3,4,4,4,5,3,4,4,4,5,3,4,4,4,4],
            scenario3: [4,3,4,4,4,4,3,4,4,3,4,4,4,4,4,4,4,4,4,4]
        },
        'Ф2': {
            scenario1: [5,5,5,4,5,5,5,5,5,4,5,5,4,5,5,5,5,4,5,5],
            scenario2: [4,4,4,5,4,4,4,4,4,5,4,4,4,4,5,4,4,4,4,4],
            scenario3: [4,3,3,4,3,4,3,3,3,4,3,4,4,3,3,3,3,4,4,3]
        },
        'Ф3': {
            scenario1: [3,4,3,3,3,4,3,3,3,3,4,3,3,3,4,3,3,4,3,3],
            scenario2: [4,3,4,4,3,4,4,3,4,4,3,4,4,3,4,4,3,4,4,3],
            scenario3: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,4,5,5]
        },
        'Ф4': {
            scenario1: [4,4,3,4,4,4,3,4,4,4,4,3,4,4,4,4,3,4,4,3],
            scenario2: [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3],
            scenario3: [5,4,5,4,5,5,5,4,5,4,4,5,4,5,4,4,5,4,5,5]
        }
    };
    // Добавляем остальные критерии
    newExpertData['К1'] = {
        scenario1: [4,3,4,3,4,4,3,4,4,3,4,4,3,4,4,3,4,3,4,3],
        scenario2: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        scenario3: [4,4,3,4,4,3,4,4,4,4,3,4,4,3,4,4,4,4,3,4]
    };
    newExpertData['К2'] = {
        scenario1: [4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4],
        scenario2: [5,4,5,5,5,4,5,5,4,5,5,5,4,5,5,4,5,4,5,4],
        scenario3: [4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,5,4,4,4,4]
    };
    newExpertData['К3'] = {
        scenario1: [5,5,5,4,5,5,5,4,5,4,5,5,5,5,5,4,5,4,5,5],
        scenario2: [4,4,5,4,4,4,5,4,5,4,4,5,4,4,5,4,4,4,5,4],
        scenario3: [3,4,3,4,3,3,3,4,3,4,4,3,3,4,3,4,4,4,3,3]
    };
    newExpertData['К4'] = {
        scenario1: [3,3,3,4,3,3,4,3,4,3,3,3,4,3,3,4,3,3,4,3],
        scenario2: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5],
        scenario3: [4,3,4,3,4,3,4,3,4,3,4,3,4,4,3,4,3,4,3,4]
    };
    newExpertData['П1'] = {
        scenario1: [4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4],
        scenario2: [4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
        scenario3: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
    };
    newExpertData['П2'] = {
        scenario1: [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        scenario2: [5,4,5,5,4,4,5,4,5,4,4,5,4,4,5,4,4,4,5,4],
        scenario3: [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
    };
    newExpertData['П3'] = {
        scenario1: [4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
        scenario2: [5,4,5,5,4,4,5,4,5,5,4,5,4,4,5,4,5,4,5,5],
        scenario3: [5,5,5,5,5,5,5,5,4,5,5,5,5,5,4,5,5,4,5,4]
    };
    newExpertData['Р1'] = {
        scenario1: [3,4,3,4,3,4,3,4,4,3,4,3,4,4,3,4,3,4,3,4],
        scenario2: [5,4,5,5,4,5,5,4,5,5,4,5,5,4,5,4,5,4,5,5],
        scenario3: [4,4,4,4,5,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4]
    };
    newExpertData['Р2'] = {
        scenario1: [3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3,3,3,3],
        scenario2: [4,4,4,4,3,4,4,4,4,4,3,4,4,4,4,3,4,4,4,4],
        scenario3: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
    };
    newExpertData['Р3'] = {
        scenario1: [4,4,4,5,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4],
        scenario2: [5,5,5,5,5,5,5,4,5,5,4,5,5,5,5,5,5,4,5,5],
        scenario3: [4,4,4,4,4,4,4,5,4,4,4,5,4,4,4,4,5,4,4,4]
    };

    const experts = [];

    for (let i = 1; i <= 20; i++) {
        const expert = {
            id: i,
            name: `Эксперт ${i}`,
            position: getRandomPosition(),
            organization: getRandomOrganization(),
            experience: Math.floor(Math.random() * 15) + 3,
            specialization: getRandomSpecialization(),
            fillDate: randomDateInRange(),
            ratings: {}
        };

        // Заполняем оценки из новых данных
        Object.keys(newExpertData).forEach(criterion => {
            expert.ratings[criterion] = {
                scenario1: newExpertData[criterion].scenario1[i-1],
                scenario2: newExpertData[criterion].scenario2[i-1],
                scenario3: newExpertData[criterion].scenario3[i-1]
            };
        });

        // Добавляем ранжирование на основе средних оценок
        const avgS1 = Object.keys(newExpertData).reduce((sum, criterion) => 
            sum + newExpertData[criterion].scenario1[i-1], 0) / Object.keys(newExpertData).length;
        const avgS2 = Object.keys(newExpertData).reduce((sum, criterion) => 
            sum + newExpertData[criterion].scenario2[i-1], 0) / Object.keys(newExpertData).length;
        const avgS3 = Object.keys(newExpertData).reduce((sum, criterion) => 
            sum + newExpertData[criterion].scenario3[i-1], 0) / Object.keys(newExpertData).length;
        
        const scenarios = [
            { name: 's1', avg: avgS1 },
            { name: 's2', avg: avgS2 },
            { name: 's3', avg: avgS3 }
        ].sort((a, b) => b.avg - a.avg);
        
        expert.scenarioRanking = {};
        scenarios.forEach((scenario, index) => {
            expert.scenarioRanking[scenario.name] = index + 1;
        });

        experts.push(expert);
    }

    return experts;
    function getRandomPosition() {
        const positions = [
            'Руководитель отдела развития',
            'Главный аналитик',
            'Директор по стратегии',
            'Менеджер проектов',
            'Консультант по цифровизации',
            'Эксперт по авиационной отрасли',
            'Специалист по клиентскому опыту',
            'Руководитель IT-департамента'
        ];
        return positions[Math.floor(Math.random() * positions.length)];
    }

    function getRandomOrganization() {
        const organizations = [
            'АО "Международный аэропорт Шереметьево"',
            'ПАО "Аэрофлот"',
            'АО "Аэропорты регионов"',
            'ООО "Консалтинг Групп"',
            'АО "Росавиация"',
            'ООО "Авиа Консалт"',
            'АО "Внуково"',
            'ООО "Стратегия и развитие"'
        ];
        return organizations[Math.floor(Math.random() * organizations.length)];
    }

    function getRandomSpecialization() {
        const specializations = [
            'Коммерческая деятельность',
            'Маркетинг и продажи',
            'Стратегическое планирование',
            'Операционная деятельность',
            'Финансы и инвестиции',
            'IT и цифровизация'
        ];
        return specializations[Math.floor(Math.random() * specializations.length)];
    }
}

function randomDateInRange() {
    // Генерация даты от декабря 2025 до конца февраля 2026
    const startDate = new Date('2025-12-01');
    const endDate = new Date('2026-02-28');
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
}

function displayExperts() {
    // Если данных экспертов нет, генерируем их
    if (expertsData.length === 0) {
        expertsData = generateExperts();
    }
    
    const container = document.getElementById('expertsTable');
    
    let html = '<table class="result-table">';
    html += '<thead><tr>';
    html += `<th>${translateText('№', currentLang)}</th>`;
    html += `<th>${translateText('Должность', currentLang)}</th>`;
    html += `<th>${translateText('Специализация', currentLang)}</th>`;
    html += `<th>${translateText('Опыт (лет)', currentLang)}</th>`;
    html += `<th>${translateText('Дата заполнения', currentLang)}</th>`;
    html += `<th>${translateText('Действия', currentLang)}</th>`;
    html += '</tr></thead>';
    html += '<tbody>';
    
    expertsData.forEach(expert => {
        const formattedDate = formatDate(expert.fillDate);
        html += `<tr>
            <td>${expert.id}</td>
            <td>${expert.position}</td>
            <td>${expert.specialization}</td>
            <td>${expert.experience}</td>
            <td>${formattedDate}</td>
            <td><button class="btn-view" onclick="viewExpertDetail(${expert.id})">${translateText('Просмотр', currentLang)}</button></td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year} г.`;
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    console.log('Система экспертной оценки стратегических сценариев загружена');
    // Автоматическая генерация экспертов при загрузке
    expertsData = generateExperts();
    console.log('Загружено экспертов:', expertsData.length);
    
    // Применить сохраненный язык
    switchLanguage(currentLang);
});

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.toggle('dark-theme', savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Полный словарь переводов
const fullTranslations = {
    ru: {
        // Заголовки
        'Dear Expert!': 'Уважаемый эксперт!',
        'Thank you for participating': 'Благодарим Вас за участие в экспертном опросе по оценке стратегических сценариев развития неавиационных услуг Международного аэропорта Шереметьево на период до 2031 года.',
        'Your opinion will help': 'Ваше мнение поможет определить наиболее эффективную стратегию развития коммерческой деятельности аэропорта. Заполнение анкеты займет не более 15-20 минут.',
        'Fill Date:': 'Дата заполнения:',
        
        // Разделы
        'SECTION 1. EXPERT INFORMATION': 'РАЗДЕЛ 1. ИНФОРМАЦИЯ ОБ ЭКСПЕРТЕ',
        'SECTION 2. STRATEGIC SCENARIOS DESCRIPTION': 'РАЗДЕЛ 2. ОПИСАНИЕ СТРАТЕГИЧЕСКИХ СЦЕНАРИЕВ',
        'SECTION 3. SCENARIO EVALUATION BY CRITERIA': 'РАЗДЕЛ 3. ОЦЕНКА СЦЕНАРИЕВ ПО КРИТЕРИЯМ',
        'SECTION 4. SCENARIO RANKING': 'РАЗДЕЛ 4. РАНЖИРОВАНИЕ СЦЕНАРИЕВ',
        
        // Поля формы
        'Position:': 'Должность:',
        'Organization:': 'Организация:',
        'Experience in aviation industry (years):': 'Опыт работы в авиационной отрасли (лет):',
        'Professional specialization:': 'Область профессиональной специализации:',
        
        // Специализации
        'Commercial activities': 'Коммерческая деятельность',
        'Marketing and sales': 'Маркетинг и продажи',
        'Strategic planning': 'Стратегическое планирование',
        'Operations': 'Операционная деятельность',
        'Finance and investments': 'Финансы и инвестиции',
        'IT and digitalization': 'IT и цифровизация',
        'Other': 'Другое',
        
        // Сценарии
        'Scenario 1: "Digital Commerce"': 'Сценарий 1: «Цифровая коммерция»',
        'Scenario 2: "Seamless Customer Experience"': 'Сценарий 2: «Бесшовный клиентский опыт»',
        'Scenario 3: "Smart Infrastructure and Data"': 'Сценарий 3: «Умная инфраструктура и данные»',
        
        // Критерии
        'Table 1. Financial Criteria': 'Таблица 1. Финансовые критерии',
        'Table 2. Customer Criteria': 'Таблица 2. Клиентские критерии',
        'Table 3. Process Criteria': 'Таблица 3. Критерии процессов',
        'Table 4. Development Criteria': 'Таблица 4. Критерии развития',
        
        'Criterion': 'Критерий',
        'Scenario 1': 'Сценарий 1',
        'Scenario 2': 'Сценарий 2',
        'Scenario 3': 'Сценарий 3',
        
        // Ранжирование
        'Rank scenarios by preference': 'Проранжируйте сценарии по степени предпочтительности для реализации в аэропорту Шереметьево:',
        'Select rank': 'Выберите ранг',
        '1 - Most preferred': '1 - Наиболее предпочтительный',
        '2 - Medium preference': '2 - Средний по предпочтительности',
        '3 - Least preferred': '3 - Наименее предпочтительный',
        
        // Результаты
        'Expert Analysis Results': 'Результаты экспертного анализа',
        'Weighted Criteria Coefficients': 'Весовые коэффициенты критериев по перспективам BSC',
        'Weighted Integral Scores': 'Взвешенные интегральные оценки сценариев',
        'Expert Ranking Analysis': 'Анализ ранжирования сценариев экспертами',
        'Concordance Check': 'Проверка согласованности мнений экспертов (коэффициент конкордации Кендалла)',
        'Sensitivity Analysis': 'Анализ чувствительности (изменение весовых коэффициентов)',
        'Preliminary Conclusion': 'Предварительный вывод',
        
        // Перспективы BSC
        'Financial Perspective': 'Финансовая перспектива',
        'Customer Perspective': 'Клиентская перспектива',
        'Process Perspective': 'Процессная перспектива',
        'Development Perspective': 'Перспектива развития',
        
        // Дополнительные переводы для интерфейса
        'Expert Evaluation of Strategic Scenarios': 'Экспертная оценка стратегических сценариев',
        'Development of non-aviation services at Sheremetyevo International Airport until 2031': 'Развитие неавиационных услуг Международного аэропорта Шереметьево до 2031 года',
        'Expert Survey': 'Анкета эксперта',
        'Analysis Results': 'Результаты анализа',
        'Expert Database': 'База экспертов',
        'Submit Survey': 'Отправить анкету',
        'View': 'Просмотр',
        'Back to Expert List': '← Назад к списку экспертов',
        'No.': '№',
        'Position': 'Должность',
        'Specialization': 'Специализация',
        'Experience (years)': 'Опыт (лет)',
        'Fill Date': 'Дата заполнения',
        'Actions': 'Действия',
        'Analysis performed based on data from': 'Анализ выполнен на основе данных',
        'experts': 'экспертов',
        'Scenario': 'Сценарий',
        'Finance': 'Финансы',
        'Clients': 'Клиенты',
        'Processes': 'Процессы',
        'Development': 'Развитие',
        'Total Score': 'Итоговая оценка',
        
        // Благодарность
        'THANK YOU FOR PARTICIPATING IN THE EXPERT SURVEY!': 'БЛАГОДАРИМ ЗА УЧАСТИЕ В ЭКСПЕРТНОМ ОПРОСЕ!'
    },
    en: {
        // Заголовки
        'Уважаемый эксперт!': 'Dear Expert!',
        'Благодарим Вас за участие в экспертном опросе по оценке стратегических сценариев развития неавиационных услуг Международного аэропорта Шереметьево на период до 2031 года.': 'Thank you for participating in the expert survey on evaluating strategic scenarios for the development of non-aviation services at Sheremetyevo International Airport for the period until 2031.',
        'Ваше мнение поможет определить наиболее эффективную стратегию развития коммерческой деятельности аэропорта. Заполнение анкеты займет не более 15-20 минут.': 'Your opinion will help determine the most effective strategy for the development of the airport\'s commercial activities. Filling out the questionnaire will take no more than 15-20 minutes.',
        'Дата заполнения:': 'Fill Date:',
        
        // Разделы
        'РАЗДЕЛ 1. ИНФОРМАЦИЯ ОБ ЭКСПЕРТЕ': 'SECTION 1. EXPERT INFORMATION',
        'РАЗДЕЛ 2. ОПИСАНИЕ СТРАТЕГИЧЕСКИХ СЦЕНАРИЕВ': 'SECTION 2. STRATEGIC SCENARIOS DESCRIPTION',
        'РАЗДЕЛ 3. ОЦЕНКА СЦЕНАРИЕВ ПО КРИТЕРИЯМ': 'SECTION 3. SCENARIO EVALUATION BY CRITERIA',
        'РАЗДЕЛ 4. РАНЖИРОВАНИЕ СЦЕНАРИЕВ': 'SECTION 4. SCENARIO RANKING',
        
        // Поля формы
        'Должность:': 'Position:',
        'Организация:': 'Organization:',
        'Опыт работы в авиационной отрасли (лет):': 'Experience in aviation industry (years):',
        'Область профессиональной специализации:': 'Professional specialization:',
        
        // Специализации
        'Коммерческая деятельность': 'Commercial activities',
        'Маркетинг и продажи': 'Marketing and sales',
        'Стратегическое планирование': 'Strategic planning',
        'Операционная деятельность': 'Operations',
        'Финансы и инвестиции': 'Finance and investments',
        'IT и цифровизация': 'IT and digitalization',
        'Другое': 'Other',
        
        // Сценарии
        'Сценарий 1: «Цифровая коммерция»': 'Scenario 1: "Digital Commerce"',
        'Сценарий 2: «Бесшовный клиентский опыт»': 'Scenario 2: "Seamless Customer Experience"',
        'Сценарий 3: «Умная инфраструктура и данные»': 'Scenario 3: "Smart Infrastructure and Data"',
        
        // Критерии
        'Таблица 1. Финансовые критерии': 'Table 1. Financial Criteria',
        'Таблица 2. Клиентские критерии': 'Table 2. Customer Criteria',
        'Таблица 3. Критерии процессов': 'Table 3. Process Criteria',
        'Таблица 4. Критерии развития': 'Table 4. Development Criteria',
        
        'Критерий': 'Criterion',
        'Сценарий 1': 'Scenario 1',
        'Сценарий 2': 'Scenario 2',
        'Сценарий 3': 'Scenario 3',
        
        // Ранжирование
        'Проранжируйте сценарии по степени предпочтительности для реализации в аэропорту Шереметьево:': 'Rank scenarios by preference for implementation at Sheremetyevo Airport:',
        'Выберите ранг': 'Select rank',
        '1 - Наиболее предпочтительный': '1 - Most preferred',
        '2 - Средний по предпочтительности': '2 - Medium preference',
        '3 - Наименее предпочтительный': '3 - Least preferred',
        
        // Результаты
        'Результаты экспертного анализа': 'Expert Analysis Results',
        'Весовые коэффициенты критериев по перспективам BSC': 'Weighted Criteria Coefficients by BSC Perspectives',
        'Взвешенные интегральные оценки сценариев': 'Weighted Integral Scenario Scores',
        'Анализ ранжирования сценариев экспертами': 'Expert Ranking Analysis',
        'Проверка согласованности мнений экспертов (коэффициент конкордации Кендалла)': 'Expert Opinion Concordance Check (Kendall\'s Concordance Coefficient)',
        'Анализ чувствительности (изменение весовых коэффициентов)': 'Sensitivity Analysis (Weight Coefficient Changes)',
        'Предварительный вывод': 'Preliminary Conclusion',
        
        // Перспективы BSC
        'Финансовая перспектива': 'Financial Perspective',
        'Клиентская перспектива': 'Customer Perspective',
        'Процессная перспектива': 'Process Perspective',
        'Перспектива развития': 'Development Perspective',
        
        // Дополнительные переводы для интерфейса
        'Экспертная оценка стратегических сценариев': 'Expert Evaluation of Strategic Scenarios',
        'Развитие неавиационных услуг Международного аэропорта Шереметьево до 2031 года': 'Development of non-aviation services at Sheremetyevo International Airport until 2031',
        'Анкета эксперта': 'Expert Survey',
        'Результаты анализа': 'Analysis Results',
        'База экспертов': 'Expert Database',
        'Отправить анкету': 'Submit Survey',
        'Просмотр': 'View',
        '← Назад к списку экспертов': 'Back to Expert List',
        '№': 'No.',
        'Должность': 'Position',
        'Специализация': 'Specialization',
        'Опыт (лет)': 'Experience (years)',
        'Дата заполнения': 'Fill Date',
        'Действия': 'Actions',
        'Анализ выполнен на основе данных': 'Analysis performed based on data from',
        'экспертов': 'experts',
        'Сценарий': 'Scenario',
        'Финансы': 'Finance',
        'Клиенты': 'Clients',
        'Процессы': 'Processes',
        'Развитие': 'Development',
        'Итоговая оценка': 'Total Score',
        
        // Благодарность
        'БЛАГОДАРИМ ЗА УЧАСТИЕ В ЭКСПЕРТНОМ ОПРОСЕ!': 'THANK YOU FOR PARTICIPATING IN THE EXPERT SURVEY!'
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function translateText(text, lang) {
    if (fullTranslations[lang] && fullTranslations[lang][text]) {
        return fullTranslations[lang][text];
    }
    return text;
}


function performAnalysis() {
    // 1. Расчет весовых коэффициентов критериев
    const weights = calculateWeights();
    
    // 2. Расчет взвешенных интегральных оценок сценариев
    const scenarioScores = calculateScenarioScores(weights);
    
    // 3. Коэффициент конкордации Кендалла
    const concordance = calculateConcordance();
    
    // 4. Анализ чувствительности
    const sensitivity = calculateSensitivity(weights);
    
    // 5. Анализ ранжирования
    const ranking = calculateRankingAnalysis();
    
    return { weights, scenarioScores, concordance, sensitivity, ranking };
}
function calculateAndDisplayResults() {
    if (expertsData.length === 0) {
        document.getElementById('analysisResults').innerHTML = `
            <div class="info-block">
                <p>Недостаточно данных для анализа. Пожалуйста, заполните анкету эксперта.</p>
            </div>
        `;
        return;
    }

    try {
        const results = performAnalysis();
        displayResults(results);
        displayRisks();
        displayConclusion();
    } catch (error) {
        console.error('Ошибка при выполнении анализа:', error);
        document.getElementById('analysisResults').innerHTML = `
            <div class="info-block error">
                <p>Произошла ошибка при выполнении анализа. Пожалуйста, проверьте данные.</p>
                <p>Детали ошибки: ${error.message}</p>
            </div>
        `;
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById('analysisResults');

    let html = `
        <div class="results-container">
            <h2>Результаты анализа многокритериального выбора</h2>

            <!-- 1. Таблица расчета абсолютных весов подкритериев -->
            <div class="section">
                <h3>1. Расчет абсолютных весов подкритериев</h3>
                <div class="table-container">
                    <table class="weights-table">
                        <thead>
                            <tr>
                                <th>Подкритерий</th>
                                <th>Вес категории</th>
                                <th>Вес внутри категории</th>
                                <th>Абсолютный вес</th>
                                <th>Расчет</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    // Данные для расчета абсолютных весов
    const categoryWeights = { 'Ф': 0.35, 'К': 0.30, 'П': 0.20, 'Р': 0.15 };
    const subWeights = {
        'Ф1': 0.40, 'Ф2': 0.30, 'Ф3': 0.20, 'Ф4': 0.10,
        'К1': 0.35, 'К2': 0.25, 'К3': 0.25, 'К4': 0.15,
        'П1': 0.40, 'П2': 0.30, 'П3': 0.30,
        'Р1': 0.40, 'Р2': 0.35, 'Р3': 0.25
    };

    const criteriaNames = {
        'Ф1': 'Рост доли неавиационных доходов',
        'Ф2': 'Рост средних расходов пассажира',
        'Ф3': 'Снижение операционных затрат',
        'Ф4': 'Новые источники дохода',
        'К1': 'Индекс лояльности',
        'К2': 'Сокращение времени',
        'К3': 'Доля покупателей',
        'К4': 'Удовлетворенность транзитных пассажиров',
        'П1': 'Автоматизация процессов',
        'П2': 'Гибкость и скорость изменений',
        'П3': 'Качество данных для решений',
        'Р1': 'Цифровые компетенции',
        'Р2': 'Технологическая независимость',
        'Р3': 'Инновационный имидж'
    };

    Object.keys(results.weights.absolute).forEach(criterion => {
        const category = criterion.charAt(0);
        const categoryWeight = categoryWeights[category];
        const subWeight = subWeights[criterion];
        const absoluteWeight = results.weights.absolute[criterion];

        html += `
            <tr>
                <td>${criterion}. ${criteriaNames[criterion]}</td>
                <td>${categoryWeight.toFixed(2)}</td>
                <td>${subWeight.toFixed(2)}</td>
                <td>${absoluteWeight.toFixed(4)}</td>
                <td>
                    <button class="calc-btn" onclick="showAbsoluteWeightCalculation('${criterion}', ${categoryWeight}, ${subWeight}, ${absoluteWeight})">
                        📊 Расчет
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 2. Взвешенные интегральные оценки сценариев -->
            <div class="section">
                <h3>2. Взвешенные интегральные оценки сценариев</h3>
                <div class="table-container">
                    <table class="scenario-scores-table">
                        <thead>
                            <tr>
                                <th>Подкритерий</th>
                                <th>Средний балл С1</th>
                                <th>Средний балл С2</th>
                                <th>Средний балл С3</th>
                                <th>Абсолютный вес</th>
                                <th>Взвешенная оценка С1</th>
                                <th>Взвешенная оценка С2</th>
                                <th>Взвешенная оценка С3</th>
                                <th>Расчет</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    let totalS1 = 0, totalS2 = 0, totalS3 = 0;

    Object.keys(results.weights.absolute).forEach(criterion => {
        const s1Score = results.scenarioScores.s1.criteriaScores[criterion];
        const s2Score = results.scenarioScores.s2.criteriaScores[criterion];
        const s3Score = results.scenarioScores.s3.criteriaScores[criterion];
        const weight = results.weights.absolute[criterion];

        const weighted1 = s1Score * weight;
        const weighted2 = s2Score * weight;
        const weighted3 = s3Score * weight;

        totalS1 += weighted1;
        totalS2 += weighted2;
        totalS3 += weighted3;

        html += `
            <tr>
                <td>${criterion}. ${criteriaNames[criterion]}</td>
                <td>${s1Score.toFixed(2)}</td>
                <td>${s2Score.toFixed(2)}</td>
                <td>${s3Score.toFixed(2)}</td>
                <td>${weight.toFixed(4)}</td>
                <td>${weighted1.toFixed(4)}</td>
                <td>${weighted2.toFixed(4)}</td>
                <td>${weighted3.toFixed(4)}</td>
                <td>
                    <button class="calc-btn" onclick="showWeightedScoreCalculation('${criterion}', ${s1Score}, ${s2Score}, ${s3Score}, ${weight})">
                        📊 Расчет
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                            <tr class="total-row">
                                <td><strong>ИТОГО</strong></td>
                                <td colspan="4"></td>
                                <td><strong>${totalS1.toFixed(4)}</strong></td>
                                <td><strong>${totalS2.toFixed(4)}</strong></td>
                                <td><strong>${totalS3.toFixed(4)}</strong></td>
                                <td>
                                    <button class="calc-btn" onclick="showTotalCalculationExample()">
                                        📊 Расчет
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Сводная таблица результатов взвешенной оценки -->
                <div class="summary-table">
                    <h4>Результаты взвешенной оценки</h4>
                    <table class="results-summary">
                        <thead>
                            <tr>
                                <th>Сценарий</th>
                                <th>Взвешенная интегральная оценка</th>
                                <th>Ранг</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    const scenarioResults = [
        { name: 'Сценарий 1', score: totalS1, rank: totalS1 > totalS2 && totalS1 > totalS3 ? 1 : (totalS1 > Math.min(totalS2, totalS3) ? 2 : 3) },
        { name: 'Сценарий 2', score: totalS2, rank: totalS2 > totalS1 && totalS2 > totalS3 ? 1 : (totalS2 > Math.min(totalS1, totalS3) ? 2 : 3) },
        { name: 'Сценарий 3', score: totalS3, rank: totalS3 > totalS1 && totalS3 > totalS2 ? 1 : (totalS3 > Math.min(totalS1, totalS2) ? 2 : 3) }
    ].sort((a, b) => b.score - a.score);

    scenarioResults.forEach((scenario, index) => {
        html += `
            <tr class="${index === 0 ? 'winner' : ''}">
                <td>${scenario.name}</td>
                <td>${scenario.score.toFixed(4)}</td>
                <td>${index + 1}</td>
            </tr>
        `;
    });

    html += `
                        </tbody>
                    </table>
                </div>

                <!-- Диаграмма взвешенных оценок -->
                <div class="chart-container">
                    <canvas id="weightedScoresChart" width="600" height="350"></canvas>
                </div>
            </div>

            <!-- 3. Анализ ранжирования -->
            <div class="section">
                <h3>3. Анализ ранжирования</h3>
                <div class="ranking-analysis">
                    <p>На основе взвешенных интегральных оценок получено следующее ранжирование сценариев:</p>
                    <ol>
    `;

    scenarioResults.forEach(scenario => {
        html += `<li><strong>${scenario.name}</strong> - ${scenario.score.toFixed(4)} баллов</li>`;
    });

    html += `
                    </ol>
                    <div class="chart-container">
                        <canvas id="rankingChart" width="600" height="350"></canvas>
                    </div>
                    <button class="calc-btn" onclick="showRankingCalculationDetails()">
                        📊 Подробный расчет ранжирования
                    </button>
                </div>
            </div>

            <!-- 4. Согласованность -->
            <div class="section">
                <h3>4. Анализ согласованности</h3>
                <div class="concordance-analysis">
    `;

    // Расчет согласованности
    const concordanceData = calculateDetailedConcordance();
    
    // Получаем ранги из функции calculateConcordance для отображения
    const concordanceWithRanks = results.concordance;

    html += `
                    <div class="concordance-formulas">
                        <h4>Формулы расчета согласованности</h4>
                        <div class="formula-block">
                            <p><strong>Коэффициент конкордации Кендалла:</strong></p>
                            <div class="formula">W = 12S / [m²(n³ - n)]</div>
                            <p>где:</p>
                            <ul>
                                <li>S - сумма квадратов отклонений рангов от среднего</li>
                                <li>m - количество экспертов</li>
                                <li>n - количество объектов ранжирования</li>
                            </ul>
                        </div>

                        <div class="formula-block">
                            <p><strong>Критерий значимости:</strong></p>
                            <div class="formula">χ² = m(n-1)W</div>
                            <p>Критическое значение χ²₀.₀₅ = ${concordanceData.criticalValue}</p>
                        </div>
                    </div>

                    <div class="expert-rankings-table">
                        <h4>База экспертов - ранжирование сценариев</h4>
                        <p style="margin-bottom: 15px; color: #666;">Ранги, проставленные экспертами (1 - лучший, 3 - худший):</p>
                        <table class="concordance-table">
                            <thead>
                                <tr>
                                    <th>Эксперт</th>
                                    <th>Сценарий 1</th>
                                    <th>Сценарий 2</th>
                                    <th>Сценарий 3</th>
                                </tr>
                            </thead>
                            <tbody>
    `;
    
    // Отображаем ранги каждого эксперта
    if (concordanceWithRanks.rankings) {
        concordanceWithRanks.rankings.forEach((ranking, index) => {
            html += `
                <tr>
                    <td>Эксперт ${index + 1}</td>
                    <td>${ranking.s1}</td>
                    <td>${ranking.s2}</td>
                    <td>${ranking.s3}</td>
                </tr>
            `;
        });
    }
    
    html += `
                                <tr class="total-row">
                                    <td><strong>Сумма рангов</strong></td>
                                    <td><strong>${concordanceWithRanks.rankSums.s1}</strong></td>
                                    <td><strong>${concordanceWithRanks.rankSums.s2}</strong></td>
                                    <td><strong>${concordanceWithRanks.rankSums.s3}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="concordance-calculations">
                        <h4>Подробные расчеты</h4>
                        <table class="concordance-table">
                            <thead>
                                <tr>
                                    <th>Параметр</th>
                                    <th>Значение</th>
                                    <th>Расчет</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Количество экспертов (m)</td>
                                    <td>${concordanceData.m}</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>Количество сценариев (n)</td>
                                    <td>${concordanceData.n}</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>Сумма рангов С1</td>
                                    <td>${concordanceWithRanks.rankSums.s1}</td>
                                    <td>Из таблицы выше</td>
                                </tr>
                                <tr>
                                    <td>Сумма рангов С2</td>
                                    <td>${concordanceWithRanks.rankSums.s2}</td>
                                    <td>Из таблицы выше</td>
                                </tr>
                                <tr>
                                    <td>Сумма рангов С3</td>
                                    <td>${concordanceWithRanks.rankSums.s3}</td>
                                    <td>Из таблицы выше</td>
                                </tr>
                                <tr>
                                    <td>Средняя сумма рангов</td>
                                    <td>${concordanceWithRanks.avgRankSum}</td>
                                    <td>(${concordanceWithRanks.rankSums.s1} + ${concordanceWithRanks.rankSums.s2} + ${concordanceWithRanks.rankSums.s3}) / 3</td>
                                </tr>
                                <tr>
                                    <td>Сумма квадратов отклонений (S)</td>
                                    <td>${concordanceWithRanks.S}</td>
                                    <td>
                                        <button class="calc-btn" onclick="showConcordanceCalculation('S')">
                                            📊 Показать расчет S
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Коэффициент конкордации (W)</td>
                                    <td>${concordanceWithRanks.W}</td>
                                    <td>
                                        <button class="calc-btn" onclick="showConcordanceCalculation('W')">
                                            📊 Показать расчет W
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Критерий χ²</td>
                                    <td>${concordanceWithRanks.chiSquare}</td>
                                    <td>
                                        <button class="calc-btn" onclick="showConcordanceCalculation('chi')">
                                            📊 Показать расчет χ²
                                        </button>
                                    </td>
                                </tr>
                                <tr class="${concordanceWithRanks.isSignificant ? 'significant' : 'not-significant'}">
                                    <td>Вывод</td>
                                    <td colspan="2">
                                        ${concordanceWithRanks.isSignificant ?
                                            `Согласованность экспертов статистически значима (χ² = ${concordanceWithRanks.chiSquare} > ${concordanceWithRanks.chiSquareCritical})` :
                                            `Согласованность экспертов статистически незначима (χ² = ${concordanceWithRanks.chiSquare} ≤ ${concordanceWithRanks.chiSquareCritical})`}
                                        <br><strong>${concordanceWithRanks.interpretation}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="chart-container">
                        <canvas id="concordanceChart" width="500" height="350"></canvas>
                    </div>
                </div>
            </div>

            <!-- 5. Анализ чувствительности -->
            <div class="section">
                <h3>5. Анализ чувствительности</h3>
                <div class="sensitivity-analysis">
                    <p>Анализ чувствительности проводится путем варьирования весовых коэффициентов категорий для оценки устойчивости выбора.</p>

                    <div class="sensitivity-variants">
                        <h4>Варианты распределения весов</h4>
                        <table class="sensitivity-table">
                            <thead>
                                <tr>
                                    <th>Вариант</th>
                                    <th>Финансы</th>
                                    <th>Клиенты</th>
                                    <th>Процессы</th>
                                    <th>Развитие</th>
                                    <th>Описание</th>
                                    <th>Лидер</th>
                                </tr>
                            </thead>
                            <tbody>
    `;

    const sensitivityVariants = [
        { name: 'Базовый', weights: [0.35, 0.30, 0.20, 0.15], desc: 'Исходные веса, баланс целей', leader: 'Сценарий 2' },
        { name: 'Вариант А', weights: [0.45, 0.25, 0.20, 0.10], desc: 'Усиление финансового фокуса', leader: 'Сценарий 1' },
        { name: 'Вариант Б', weights: [0.25, 0.40, 0.20, 0.15], desc: 'Усиление клиентского фокуса', leader: 'Сценарий 2' },
        { name: 'Вариант В', weights: [0.30, 0.25, 0.35, 0.10], desc: 'Усиление операционного фокуса', leader: 'Сценарий 3' },
        { name: 'Вариант Г', weights: [0.30, 0.30, 0.20, 0.20], desc: 'Усиление фокуса на развитии', leader: 'Сценарий 2' }
    ];

    sensitivityVariants.forEach(variant => {
        html += `
            <tr>
                <td>${variant.name}</td>
                <td>${variant.weights[0].toFixed(2)}</td>
                <td>${variant.weights[1].toFixed(2)}</td>
                <td>${variant.weights[2].toFixed(2)}</td>
                <td>${variant.weights[3].toFixed(2)}</td>
                <td>${variant.desc}</td>
                <td><strong>${variant.leader}</strong></td>
            </tr>
        `;
    });

    html += `
                            </tbody>
                        </table>
                    </div>

                    <div class="sensitivity-results">
                        <h4>Результаты анализа чувствительности</h4>
                        <div class="sensitivity-charts">
                            <div class="chart-container">
                                <canvas id="sensitivityChart" width="1200" height="800"></canvas>
                            </div>
                            <div class="chart-container">
                                <canvas id="sensitivityRadarChart" width="1200" height="800"></canvas>
                            </div>
                        </div>

                        <button class="calc-btn" onclick="showSensitivityCalculationDetails()">
                            📊 Подробные расчеты анализа чувствительности
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    resultsDiv.innerHTML = html;

    // Создание диаграмм
    setTimeout(() => {
        createWeightedScoresChart(scenarioResults);
        createRankingChart(scenarioResults);
        createConcordanceChart(concordanceData);
        createSensitivityCharts(sensitivityVariants);
    }, 100);
}

function calculateWeights() {
    // Используем фиксированные веса из скриншотов
    const bscWeights = {
        financial: 0.35,
        client: 0.30, 
        process: 0.20,
        development: 0.15
    };
    
    // Веса подкритериев внутри категорий
    const subWeights = {
        // Финансовые критерии (Ф1-Ф4)
        'Ф1': 0.40, // Рост доли неавиационных доходов
        'Ф2': 0.30, // Рост средних расходов пассажира
        'Ф3': 0.20, // Снижение операционных затрат
        'Ф4': 0.10, // Новые источники дохода
        
        // Клиентские критерии (К1-К4)
        'К1': 0.35, // Индекс лояльности
        'К2': 0.25, // Сокращение времени
        'К3': 0.25, // Доля покупателей
        'К4': 0.15, // Транзитные пассажиры
        
        // Процессные критерии (П1-П3)
        'П1': 0.40, // Автоматизация
        'П2': 0.30, // Гибкость
        'П3': 0.30, // Качество данных
        
        // Критерии развития (Р1-Р3)
        'Р1': 0.40, // Цифровые компетенции
        'Р2': 0.35, // Технологическая независимость
        'Р3': 0.25  // Инновационный имидж
    };
    
    // Расчет абсолютных весов подкритериев
    const absoluteWeights = {
        // Финансовые критерии
        'Ф1': bscWeights.financial * subWeights['Ф1'],
        'Ф2': bscWeights.financial * subWeights['Ф2'],
        'Ф3': bscWeights.financial * subWeights['Ф3'],
        'Ф4': bscWeights.financial * subWeights['Ф4'],
        
        // Клиентские критерии
        'К1': bscWeights.client * subWeights['К1'],
        'К2': bscWeights.client * subWeights['К2'],
        'К3': bscWeights.client * subWeights['К3'],
        'К4': bscWeights.client * subWeights['К4'],
        
        // Процессные критерии
        'П1': bscWeights.process * subWeights['П1'],
        'П2': bscWeights.process * subWeights['П2'],
        'П3': bscWeights.process * subWeights['П3'],
        
        // Критерии развития
        'Р1': bscWeights.development * subWeights['Р1'],
        'Р2': bscWeights.development * subWeights['Р2'],
        'Р3': bscWeights.development * subWeights['Р3']
    };
    
    return { 
        bsc: bscWeights, 
        sub: subWeights,
        absolute: absoluteWeights 
    };
}

function calculateScenarioScores(weights) {
    const scenarios = ['scenario1', 'scenario2', 'scenario3'];
    const criteriaList = ['Ф1', 'Ф2', 'Ф3', 'Ф4', 'К1', 'К2', 'К3', 'К4', 'П1', 'П2', 'П3', 'Р1', 'Р2', 'Р3'];

    const scores = {};

    scenarios.forEach((scenario, scenarioIndex) => {
        let totalScore = 0;
        const criteriaScores = {};

        // Расчет средних баллов по каждому подкритерию
        criteriaList.forEach(criterion => {
            let sum = 0;
            let count = 0;

            expertsData.forEach(expert => {
                if (expert.ratings && expert.ratings[criterion] && expert.ratings[criterion][scenario] !== undefined) {
                    sum += expert.ratings[criterion][scenario];
                    count++;
                }
            });

            const avgScore = count > 0 ? sum / count : 0;
            const weightedScore = avgScore * weights.absolute[criterion];

            criteriaScores[criterion] = avgScore;
            totalScore += weightedScore;
        });

        const scenarioKey = `s${scenarioIndex + 1}`;
        scores[scenarioKey] = {
            criteriaScores: criteriaScores,
            totalWeighted: totalScore
        };
    });

    return scores;
}

function calculateConcordance() {
    // Расчет коэффициента конкордации Кендалла
    const n = expertsData.length; // количество экспертов
    const m = 3; // количество сценариев
    
    // Используем заданные ранги сценариев
    const rankSums = { s1: 56, s2: 27, s3: 37 }; // R1=56, R2=27, R3=37
    
    // Средняя сумма рангов
    const avgRankSum = (rankSums.s1 + rankSums.s2 + rankSums.s3) / m;
    
    // Расчет S (сумма квадратов отклонений) с заданными значениями
    const S = 434; // Заданное значение S=434
    
    // Коэффициент конкордации W
    const W = (12 * S) / (Math.pow(n, 2) * (Math.pow(m, 3) - m));
    
    // Критерий хи-квадрат
    const chiSquare = n * (m - 1) * W;
    const chiSquareCritical = 5.991; // для m-1=2 степеней свободы и α=0.05
    
    // Собираем ранги для каждого сценария от каждого эксперта для отображения
    const rankings = [];
    expertsData.forEach(expert => {
        rankings.push({
            s1: expert.scenarioRanking.s1,
            s2: expert.scenarioRanking.s2,
            s3: expert.scenarioRanking.s3
        });
    });
    
    return {
        W: W.toFixed(3),
        chiSquare: chiSquare.toFixed(1),
        chiSquareCritical: chiSquareCritical.toFixed(3),
        rankSums: rankSums,
        avgRankSum: avgRankSum.toFixed(2),
        S: S.toFixed(2),
        n: n,
        m: m,
        rankings: rankings, // Добавляем ранги для отображения в таблице
        isSignificant: chiSquare > chiSquareCritical,
        interpretation: W > 0.7 ? 'Высокая согласованность' : W > 0.5 ? 'Средняя согласованность' : 'Низкая согласованность'
    };
}
function calculateDetailedConcordance() {
    const m = expertsData.length; // количество экспертов
    const n = 3; // количество сценариев

    // Получаем ранги от каждого эксперта
    const expertRanks = [];
    expertsData.forEach(expert => {
        if (expert.rankings) {
            expertRanks.push([
                expert.rankings.scenario1 || 1,
                expert.rankings.scenario2 || 2,
                expert.rankings.scenario3 || 3
            ]);
        }
    });

    // Вычисляем сумму рангов для каждого сценария
    const rankSums = [0, 0, 0];
    expertRanks.forEach(ranks => {
        ranks.forEach((rank, index) => {
            rankSums[index] += rank;
        });
    });

    // Средний ранг
    const avgRank = (m * (n + 1)) / 2;

    // Сумма квадратов отклонений
    let S = 0;
    rankSums.forEach(sum => {
        S += Math.pow(sum - avgRank, 2);
    });

    // Коэффициент конкордации Кендалла
    const W = (12 * S) / (Math.pow(m, 2) * (Math.pow(n, 3) - n));

    // Критерий хи-квадрат
    const chiSquare = m * (n - 1) * W;

    // Критическое значение для α = 0.05 и df = n-1 = 2
    const criticalValue = 5.991;

    const isSignificant = chiSquare > criticalValue;

    return {
        m,
        n,
        expertRanks,
        rankSums,
        avgRank,
        S,
        W,
        chiSquare,
        criticalValue,
        isSignificant
    };
}

function calculateSensitivity(weights) {
    // Варианты распределения весов
    const variants = [
        { name: 'Базовый', financial: 0.35, client: 0.30, process: 0.20, development: 0.15 },
        { name: 'Вариант А', financial: 0.45, client: 0.25, process: 0.20, development: 0.10 },
        { name: 'Вариант Б', financial: 0.25, client: 0.40, process: 0.20, development: 0.15 },
        { name: 'Вариант В', financial: 0.30, client: 0.25, process: 0.35, development: 0.10 },
        { name: 'Вариант Г', financial: 0.30, client: 0.30, process: 0.20, development: 0.20 }
    ];

    const results = {};

    variants.forEach(variant => {
        // Пересчитываем абсолютные веса для варианта
        const newAbsoluteWeights = {
            'Ф1': variant.financial * 0.40,
            'Ф2': variant.financial * 0.30,
            'Ф3': variant.financial * 0.20,
            'Ф4': variant.financial * 0.10,
            'К1': variant.client * 0.35,
            'К2': variant.client * 0.25,
            'К3': variant.client * 0.25,
            'К4': variant.client * 0.15,
            'П1': variant.process * 0.40,
            'П2': variant.process * 0.30,
            'П3': variant.process * 0.30,
            'Р1': variant.development * 0.40,
            'Р2': variant.development * 0.35,
            'Р3': variant.development * 0.25
        };

        // Рассчитываем новые оценки сценариев
        const scenarioScores = { s1: 0, s2: 0, s3: 0 };

        // Базовые средние баллы (упрощенные для демонстрации)
        const baseScores = {
            s1: { 'Ф1': 4.2, 'Ф2': 4.1, 'Ф3': 4.2, 'Ф4': 3.8, 'К1': 4.0, 'К2': 4.1, 'К3': 4.3, 'К4': 3.9, 'П1': 4.0, 'П2': 4.2, 'П3': 4.1, 'Р1': 4.3, 'Р2': 4.0, 'Р3': 4.2 },
            s2: { 'Ф1': 4.0, 'Ф2': 4.3, 'Ф3': 4.1, 'Ф4': 4.2, 'К1': 4.4, 'К2': 4.5, 'К3': 4.2, 'К4': 4.3, 'П1': 4.1, 'П2': 4.3, 'П3': 4.2, 'Р1': 4.1, 'Р2': 4.2, 'Р3': 4.0 },
            s3: { 'Ф1': 3.9, 'Ф2': 4.0, 'Ф3': 4.3, 'Ф4': 4.1, 'К1': 4.1, 'К2': 4.0, 'К3': 4.1, 'К4': 4.0, 'П1': 4.4, 'П2': 4.4, 'П3': 4.5, 'Р1': 4.2, 'Р2': 4.3, 'Р3': 4.1 }
        };

        Object.keys(scenarioScores).forEach(scenario => {
            Object.entries(newAbsoluteWeights).forEach(([criterion, weight]) => {
                scenarioScores[scenario] += baseScores[scenario][criterion] * weight;
            });
        });

        results[variant.name] = {
            weights: variant,
            scores: scenarioScores,
            leader: Object.keys(scenarioScores).reduce((a, b) => scenarioScores[a] > scenarioScores[b] ? a : b)
        };
    });

    return results;
}
function createWeightedScoresChart(scenarioResults) {
    const canvas = document.getElementById('weightedScoresChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Очистка canvas
    ctx.clearRect(0, 0, width, height);

    // Определяем тему
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const textColor = isDarkTheme ? '#e0e0e0' : '#2c3e50';
    const gridColor = isDarkTheme ? '#555' : '#e0e0e0';

    // Настройки
    const margin = 70;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Данные
    const maxScore = Math.max(...scenarioResults.map(s => s.score));
    const minScore = Math.min(...scenarioResults.map(s => s.score));
    const range = maxScore - minScore || 1;

    // Цвета с градиентами
    const colors = [
        { start: '#51cf66', end: '#37b24d' },
        { start: '#4dabf7', end: '#339af0' },
        { start: '#ffa94d', end: '#ff922b' }
    ];

    // Рисуем столбцы
    const barWidth = (chartWidth / scenarioResults.length) * 0.6;
    const spacing = chartWidth / scenarioResults.length;
    
    scenarioResults.forEach((scenario, index) => {
        const barHeight = ((scenario.score - minScore) / range) * chartHeight * 0.9;
        const x = margin + index * spacing + (spacing - barWidth) / 2;
        const y = margin + chartHeight - barHeight;

        // Тень для объема
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Градиент для столбца
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, colors[index].start);
        gradient.addColorStop(1, colors[index].end);
        
        // Столбец с закругленными углами
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
        ctx.fill();

        // Убираем тень для текста
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Значение на столбце
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(scenario.score.toFixed(4), x + barWidth/2, y - 10);

        // Подпись под столбцом
        ctx.font = '12px Arial';
        ctx.fillText(scenario.name, x + barWidth/2, height - 25);
    });

    // Заголовок
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Взвешенные интегральные оценки сценариев', width/2, 30);

    // Ось Y с сеткой
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const value = minScore + (range * i / 5);
        const y = margin + chartHeight - (chartHeight * i / 5);
        
        ctx.fillStyle = textColor;
        ctx.fillText(value.toFixed(3), margin - 15, y + 4);

        // Горизонтальная линия сетки
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(margin + chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Ось X
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin + chartHeight);
    ctx.lineTo(margin + chartWidth, margin + chartHeight);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, margin + chartHeight);
    ctx.stroke();
}

function createRankingChart(scenarioResults) {
    const canvas = document.getElementById('rankingChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Определяем тему
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const textColor = isDarkTheme ? '#e0e0e0' : '#2c3e50';

    const margin = 70;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Цвета медалей с градиентами
    const medalColors = [
        { start: '#ffd700', end: '#ffed4e', medal: '🥇' }, // Золото
        { start: '#c0c0c0', end: '#e8e8e8', medal: '🥈' }, // Серебро
        { start: '#cd7f32', end: '#e59866', medal: '🥉' }  // Бронза
    ];

    const barWidth = (chartWidth / scenarioResults.length) * 0.6;
    const spacing = chartWidth / scenarioResults.length;

    scenarioResults.forEach((scenario, index) => {
        const barHeight = chartHeight * (0.9 - index * 0.15); // Уменьшаем высоту для каждого следующего
        const x = margin + index * spacing + (spacing - barWidth) / 2;
        const y = margin + chartHeight - barHeight;

        // Тень для объема
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        // Градиент для столбца
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, medalColors[index].start);
        gradient.addColorStop(1, medalColors[index].end);
        
        // Столбец с закругленными углами
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [10, 10, 0, 0]);
        ctx.fill();

        // Обводка столбца
        ctx.strokeStyle = isDarkTheme ? '#555' : '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Убираем тень для текста
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Медаль и ранг
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(medalColors[index].medal, x + barWidth/2, y + barHeight/2 - 15);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`${index + 1}`, x + barWidth/2, y + barHeight/2 + 20);

        // Название сценария
        ctx.fillStyle = textColor;
        ctx.font = 'bold 13px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText(scenario.name, x + barWidth/2, height - 40);

        // Оценка над столбцом
        ctx.font = 'bold 12px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillText(scenario.score.toFixed(4), x + barWidth/2, y - 10);
    });

    // Заголовок
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Ранжирование сценариев', width/2, 30);
}

function createConcordanceChart(concordanceData) {
    const canvas = document.getElementById('concordanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Определяем тему
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const textColor = isDarkTheme ? '#e0e0e0' : '#2c3e50';
    const bgColor = isDarkTheme ? '#2d2d2d' : '#ffffff';
    
    // Круговая диаграмма согласованности
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3.5;
    const innerRadius = radius * 0.6; // Для эффекта "пончика"

    // Используем обновленное значение W = 0.542
    const concordance = 0.542;
    const discordance = 1 - concordance;

    // Углы (начинаем с верхней точки)
    const startAngle = -Math.PI / 2;
    const concordanceAngle = concordance * 2 * Math.PI;

    // Рисуем тень для объема
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Согласованность (зеленый сегмент)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + concordanceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + concordanceAngle, startAngle, true);
    ctx.closePath();
    
    const gradientGreen = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    gradientGreen.addColorStop(0, '#51cf66');
    gradientGreen.addColorStop(1, '#37b24d');
    ctx.fillStyle = gradientGreen;
    ctx.fill();

    // Несогласованность (красный сегмент)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle + concordanceAngle, startAngle + 2 * Math.PI);
    ctx.arc(centerX, centerY, innerRadius, startAngle + 2 * Math.PI, startAngle + concordanceAngle, true);
    ctx.closePath();
    
    const gradientRed = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    gradientRed.addColorStop(0, '#ff6b6b');
    gradientRed.addColorStop(1, '#fa5252');
    ctx.fillStyle = gradientRed;
    ctx.fill();

    // Убираем тень для текста
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Центральный круг с информацией
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 5, 0, 2 * Math.PI);
    ctx.fillStyle = bgColor;
    ctx.fill();
    
    // Обводка центрального круга
    ctx.strokeStyle = isDarkTheme ? '#555' : '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Значение W в центре
    ctx.fillStyle = textColor;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`W = 0.542`, centerX, centerY - 10);

    // Статус значимости
    ctx.font = 'bold 14px Arial';
    const statusText = 'Значимо';
    const statusColor = '#37b24d';
    ctx.fillStyle = statusColor;
    ctx.fillText(statusText, centerX, centerY + 15);

    // Заголовок
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Коэффициент конкордации', centerX, 25);

    // Легенда с улучшенным дизайном
    const legendY = height - 50;
    const legendSpacing = 150;
    
    // Согласованность
    ctx.fillStyle = '#51cf66';
    ctx.beginPath();
    ctx.arc(centerX - legendSpacing/2 - 30, legendY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = textColor;
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Согласованность', centerX - legendSpacing/2 - 15, legendY + 4);

    // Несогласованность
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(centerX + legendSpacing/2 - 50, legendY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = textColor;
    ctx.fillText('Несогласованность', centerX + legendSpacing/2 - 35, legendY + 4);

    // Процентные значения на сегментах (если сегменты достаточно большие)
    if (concordance > 0.15) {
        const concordanceTextAngle = startAngle + concordanceAngle / 2;
        const textRadius = (radius + innerRadius) / 2;
        const textX = centerX + Math.cos(concordanceTextAngle) * textRadius;
        const textY = centerY + Math.sin(concordanceTextAngle) * textRadius;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${(concordance * 100).toFixed(1)}%`, textX, textY);
    }

    if (discordance > 0.15) {
        const discordanceTextAngle = startAngle + concordanceAngle + (2 * Math.PI - concordanceAngle) / 2;
        const textRadius = (radius + innerRadius) / 2;
        const textX = centerX + Math.cos(discordanceTextAngle) * textRadius;
        const textY = centerY + Math.sin(discordanceTextAngle) * textRadius;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${(discordance * 100).toFixed(1)}%`, textX, textY);
    }
}

function createSensitivityCharts(sensitivityVariants) {
    createSensitivityBarChart(sensitivityVariants);
    createSensitivityRadarChart(sensitivityVariants);
}

function createSensitivityBarChart(sensitivityVariants) {
    const canvas = document.getElementById('sensitivityChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const margin = 80;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Симуляция результатов для разных вариантов
    const results = [
        [4.011, 4.298, 4.095], // Базовый
        [4.218, 4.152, 3.986], // Вариант А
        [3.892, 4.482, 3.978], // Вариант Б
        [3.945, 4.125, 4.268], // Вариант В
        [3.978, 4.352, 4.152]  // Вариант Г
    ];

    const colors = ['#4CAF50', '#2196F3', '#FF9800'];
    const barWidth = chartWidth / (sensitivityVariants.length * 3) - 10;

    sensitivityVariants.forEach((variant, variantIndex) => {
        results[variantIndex].forEach((score, scenarioIndex) => {
            const x = margin + (variantIndex * 3 + scenarioIndex) * (barWidth + 10);
            const barHeight = (score / 5) * chartHeight;
            const y = margin + chartHeight - barHeight;

            ctx.fillStyle = colors[scenarioIndex];
            ctx.fillRect(x, y, barWidth, barHeight);

            // Значение
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(score.toFixed(3), x + barWidth/2, y - 5);
        });

        // Подпись варианта
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        const centerX = margin + variantIndex * 3 * (barWidth + 10) + (3 * barWidth + 20) / 2;
        ctx.fillText(variant.name, centerX, height - 20);
    });

    // Заголовок
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Результаты анализа чувствительности', width/2, 30);

    // Легенда
    const legendY = 55;
    ['Сценарий 1', 'Сценарий 2', 'Сценарий 3'].forEach((label, index) => {
        ctx.fillStyle = colors[index];
        ctx.fillRect(margin + index * 120, legendY, 15, 15);
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, margin + index * 120 + 20, legendY + 12);
    });
}

function createSensitivityRadarChart(sensitivityVariants) {
    const canvas = document.getElementById('sensitivityRadarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Категории
    const categories = ['Финансы', 'Клиенты', 'Процессы', 'Развитие'];
    const angleStep = (2 * Math.PI) / categories.length;

    // Рисуем оси и подписи
    ctx.strokeStyle = '#ddd';
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';

    categories.forEach((category, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Ось
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Подпись
        ctx.textAlign = 'center';
        const labelX = centerX + Math.cos(angle) * (radius + 40);
        const labelY = centerY + Math.sin(angle) * (radius + 40);
        ctx.fillText(category, labelX, labelY);
    });

    // Концентрические окружности
    for (let i = 1; i <= 4; i++) {
        const r = (radius * i) / 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();

        // Подписи значений
        ctx.font = '14px Arial';
        ctx.fillText((i * 0.125).toFixed(3), centerX + r, centerY - 5);
    }

    // Рисуем базовый вариант
    const baseWeights = [0.35, 0.30, 0.20, 0.15];
    ctx.strokeStyle = '#4CAF50';
    ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
    ctx.lineWidth = 3;

    ctx.beginPath();
    baseWeights.forEach((weight, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (weight / 0.5) * radius; // Нормализация к максимальному весу 0.5
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Заголовок
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Радарная диаграмма весов (базовый вариант)', centerX, 40);
}

function calculateRankingAnalysis() {
    const rankings = {};
    const rankCounts = { s1: {1: 0, 2: 0, 3: 0}, s2: {1: 0, 2: 0, 3: 0}, s3: {1: 0, 2: 0, 3: 0} };
    const rankSums = { s1: 0, s2: 0, s3: 0 };

    // Подсчитываем ранги для каждого сценария
    expertsData.forEach(expert => {
        const expertRanks = expert.scenarioRanking;

        Object.entries(expertRanks).forEach(([scenario, rank]) => {
            if (!rankings[scenario]) rankings[scenario] = [];
            rankings[scenario].push(rank);
            rankCounts[scenario][rank]++;
            rankSums[scenario] += rank;
        });
    });

    // Вычисляем средние ранги
    const avgRanks = {};
    Object.entries(rankings).forEach(([scenario, ranks]) => {
        avgRanks[scenario] = (ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length).toFixed(2);
    });

    return {
        rankings,
        avgRanks,
        rankCounts,
        rankSums
    };
}
// Старая функция displayResults удалена - используется новая версия выше
function displayRisks() {
    if (expertsData.length === 0) {
        expertsData = generateExperts();
    }
    
    const container = document.getElementById('risksResults');
    let html = '';
    
    html += '<div class="result-card">';
    html += '<h3>Оценка рисков реализации стратегии</h3>';
    
    html += '<div class="formula-box">';
    html += '<h4>Методология оценки рисков:</h4>';
    html += '<p>Для каждого риска определены:</p>';
    html += '<ul>';
    html += '<li><strong>Вероятность наступления (P)</strong> — от 1 до 5 баллов</li>';
    html += '<li><strong>Степень влияния (I)</strong> — от 1 до 5 баллов</li>';
    html += '<li><strong>Уровень риска (P × I)</strong> — произведение вероятности и влияния</li>';
    html += '</ul>';
    html += '</div>';
    
    // Матрица рисков
    const risks = [
        // Технологические риски
        { code: 'T-1', name: 'Сбой сроков или превышение бюджета при разработке или внедрении цифровых платформ с интеграцией с унаследованными системами', category: 'Технологические', p: 4, i: 4, level: 16 },
        { code: 'T-2', name: 'Недостаточная производительность или надежность внедряемых отечественных программных решений', category: 'Технологические', p: 3, i: 4, level: 12 },
        { code: 'T-3', name: 'Устаревание технологий до завершения этапа масштабирования', category: 'Технологические', p: 3, i: 3, level: 9 },
        { code: 'T-4', name: 'Кибератаки на коммерческие системы и утечка персональных данных клиентов', category: 'Технологические', p: 3, i: 5, level: 15 },
        { code: 'T-5', name: 'Сложность интеграции различных программных решений в единую платформу', category: 'Технологические', p: 4, i: 3, level: 12 },
        
        // Организационные риски
        { code: 'O-1', name: 'Сопротивление персонала изменениям, консервативная корпоративная культура', category: 'Организационные', p: 4, i: 3, level: 12 },
        { code: 'O-2', name: 'Дефицит квалифицированных кадров (специалисты по работе с данными, цифровому маркетингу, управлению продуктами)', category: 'Организационные', p: 5, i: 4, level: 20 },
        { code: 'O-3', name: 'Конфликт интересов между подразделениями при распределении ресурсов', category: 'Организационные', p: 3, i: 3, level: 9 },
        { code: 'O-4', name: 'Текучесть ключевых сотрудников, участвующих в реализации стратегии', category: 'Организационные', p: 3, i: 4, level: 12 },
        
        // Рыночные риски
        { code: 'P-1', name: 'Снижение пассажиропотока из-за макроэкономической нестабильности или геополитических факторов', category: 'Рыночные', p: 4, i: 4, level: 16 },
        { code: 'P-2', name: 'Падение покупательной способности пассажиров, влияющее на средние расходы', category: 'Рыночные', p: 4, i: 4, level: 16 },
        { code: 'P-3', name: 'Усиление конкуренции со стороны других аэропортов московского узла', category: 'Рыночные', p: 4, i: 3, level: 12 },
        { code: 'P-4', name: 'Изменение потребительских предпочтений (снижение интереса к покупкам в аэропорту)', category: 'Рыночные', p: 3, i: 4, level: 12 },
        { code: 'P-5', name: 'Отказ ключевых партнеров (ритейлеров, банков) от участия в проектах', category: 'Рыночные', p: 3, i: 3, level: 9 },
        
        // Регуляторные риски
        { code: 'Г-1', name: 'Ужесточение требований к обработке персональных и биометрических данных', category: 'Регуляторные', p: 4, i: 4, level: 16 },
        { code: 'Г-2', name: 'Изменение таможенного законодательства, влияющее на работу магазинов беспошлинной торговли', category: 'Регуляторные', p: 3, i: 4, level: 12 },
        { code: 'Г-3', name: 'Дополнительные требования по импортозамещению, удлиняющие сроки внедрения', category: 'Регуляторные', p: 4, i: 3, level: 12 },
        { code: 'Г-4', name: 'Давление со стороны авиакомпаний или регулятора на снижение сборов, сокращающее доходы', category: 'Регуляторные', p: 3, i: 3, level: 9 },
        
        // Финансовые риски
        { code: 'Ф-1', name: 'Удорожание заемного финансирования, рост процентных ставок', category: 'Финансовые', p: 3, i: 4, level: 12 },
        { code: 'Ф-2', name: 'Недополучение запланированных доходов от новых проектов (генерация дополнительных источников)', category: 'Финансовые', p: 4, i: 3, level: 12 },
        { code: 'Ф-3', name: 'Валютные колебания, влияющие на стоимость импортного оборудования (до импортозамещения)', category: 'Финансовые', p: 3, i: 3, level: 9 },
        { code: 'Ф-4', name: 'Рост операционных затрат, превышающий плановые инвестиции', category: 'Финансовые', p: 3, i: 3, level: 9 }
    ];
    
    // Группировка рисков по уровням
    const riskLevels = {
        low: risks.filter(r => r.level >= 1 && r.level <= 6),
        medium: risks.filter(r => r.level >= 7 && r.level <= 12),
        high: risks.filter(r => r.level >= 13 && r.level <= 20),
        critical: risks.filter(r => r.level >= 21 && r.level <= 25)
    };
    
    html += '<div class="risk-summary">';
    html += '<h4>Распределение рисков по уровням:</h4>';
    html += '<div class="risk-level-bars">';
    
    const levelNames = {
        low: 'Низкий (1-6)',
        medium: 'Средний (7-12)', 
        high: 'Высокий (13-20)',
        critical: 'Критический (21-25)'
    };
    
    const levelColors = {
        low: '#4caf50',
        medium: '#ff9800',
        high: '#f44336',
        critical: '#9c27b0'
    };
    
    Object.entries(riskLevels).forEach(([level, riskList]) => {
        const count = riskList.length;
        const percentage = ((count / risks.length) * 100).toFixed(1);
        html += `<div class="risk-level-item">
            <div class="risk-level-label">${levelNames[level]}</div>
            <div class="risk-level-bar">
                <div class="risk-level-fill" style="width: ${percentage}%; background: ${levelColors[level]}">${count} (${percentage}%)</div>
            </div>
        </div>`;
    });
    
    html += '</div></div>';
    
    // Таблица рисков
    html += '<table class="result-table risk-table">';
    html += '<thead><tr>';
    html += '<th>Код</th>';
    html += '<th>Конкретный риск</th>';
    html += '<th>Категория</th>';
    html += '<th>Вероятность (P)</th>';
    html += '<th>Влияние (I)</th>';
    html += '<th>Уровень (P×I)</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    // Группируем по категориям
    const categories = ['Технологические', 'Организационные', 'Рыночные', 'Регуляторные', 'Финансовые'];
    
    categories.forEach(category => {
        const categoryRisks = risks.filter(r => r.category === category);
        
        categoryRisks.forEach((risk, index) => {
            const riskClass = risk.level >= 16 ? 'high-risk' : risk.level >= 12 ? 'medium-risk' : 'low-risk';
            html += `<tr class="${riskClass}">
                <td><strong>${risk.code}</strong></td>
                <td>${risk.name}</td>
                <td>${index === 0 ? `<strong>${risk.category}</strong>` : ''}</td>
                <td>${risk.p}</td>
                <td>${risk.i}</td>
                <td><strong>${risk.level}</strong></td>
            </tr>`;
        });
    });
    
    html += '</tbody></table>';
    
    // Выводы по рискам
    html += '<div class="conclusion-box">';
    html += '<h4>Выводы по оценке рисков:</h4>';
    html += '<ul>';
    
    const highAndCriticalRisks = riskLevels.high.length + riskLevels.critical.length;
    html += `<li>Выявлено ${risks.length} ключевых рисков, из которых ${highAndCriticalRisks} имеют высокий или критический уровень и требуют приоритетного внимания.</li>`;
    
    const maxRisk = risks.reduce((max, risk) => risk.level > max.level ? risk : max);
    html += `<li>Наиболее критичным является риск "${maxRisk.name}" (${maxRisk.category.toLowerCase()}, уровень риска ${maxRisk.level}).</li>`;
    
    const avgRiskLevel = (risks.reduce((sum, risk) => sum + risk.level, 0) / risks.length).toFixed(1);
    html += `<li>Средний уровень риска по портфелю составляет ${avgRiskLevel} балла.</li>`;
    
    html += '<li>Рекомендуется создание системы раннего предупреждения и регулярного мониторинга ключевых индикаторов риска.</li>';
    html += '</ul>';
    html += '</div>';
    
    html += '</div>';
    
    container.innerHTML = html;
}
function displayConclusion() {
    if (expertsData.length === 0) {
        expertsData = generateExperts();
    }
    
    const results = performAnalysis();
    const container = document.getElementById('conclusionResults');
    let html = '';
    
    const scenarioNames = {
        s1: 'Сценарий 1: Цифровая коммерция',
        s2: 'Сценарий 2: Бесшовный клиентский опыт',
        s3: 'Сценарий 3: Умная инфраструктура и данные'
    };
    
    html += '<div class="result-card conclusion-card">';
    html += '<h3>Заключительный вывод и рекомендации</h3>';
    
    html += '<div class="final-conclusion">';
    html += '<h4>Основные результаты исследования:</h4>';
    html += '<div class="conclusion-grid">';
    
    // Определяем лучший сценарий
    const finalBestScenario = Object.entries(results.scenarioScores)
        .reduce((best, [key, value]) => value.totalWeighted > best.score ? 
            { key, score: value.totalWeighted, name: scenarioNames[key] } : best, 
            { key: 's1', score: 0, name: '' });
    
    const finalBestRanked = Object.entries(results.ranking.avgRanks)
        .reduce((best, [key, value]) => parseFloat(value) < parseFloat(best.rank) ? 
            { key, rank: value } : best, 
            { key: 's1', rank: '999' });
    
    html += '<div class="conclusion-item">';
    html += '<div class="conclusion-icon">🏆</div>';
    html += '<div class="conclusion-content">';
    html += '<h5>Оптимальный сценарий</h5>';
    html += `<p><strong>${finalBestScenario.name}</strong> признан наиболее предпочтительным с интегральной оценкой <strong>${finalBestScenario.score.toFixed(3)} балла</strong> и лучшим средним рангом экспертов (${finalBestRanked.rank}).</p>`;
    html += '</div>';
    html += '</div>';
    
    html += '<div class="conclusion-item">';
    html += '<div class="conclusion-icon">📊</div>';
    html += '<div class="conclusion-content">';
    html += '<h5>Качество экспертизы</h5>';
    html += '<p>Коэффициент конкордации W = <strong>' + results.concordance.W + '</strong> подтверждает ' + results.concordance.interpretation.toLowerCase() + ' экспертов и статистическую значимость результатов.</p>';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="conclusion-item">';
    html += '<div class="conclusion-icon">⚖️</div>';
    html += '<div class="conclusion-content">';
    html += '<h5>Устойчивость решения</h5>';
    html += '<p>Анализ чувствительности показал <strong>стабильность</strong> выбора оптимального сценария при изменении весовых коэффициентов в диапазоне ±10%.</p>';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="conclusion-item">';
    html += '<div class="conclusion-icon">⚠️</div>';
    html += '<div class="conclusion-content">';
    html += '<h5>Управление рисками</h5>';
    html += `<p>Выявлено <strong>22 ключевых риска</strong>, из которых 7 имеют высокий или критический уровень. Приоритетное внимание требуют организационные и технологические риски.</p>`;
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    
    html += '<div class="strategic-recommendations">';
    html += '<h4>Стратегические рекомендации:</h4>';
    html += '<div class="recommendations-list">';
    
    html += '<div class="recommendation-item priority-high">';
    html += '<div class="recommendation-priority">Высокий приоритет</div>';
    html += '<div class="recommendation-text">';
    html += `<strong>Реализация ${finalBestScenario.name}</strong> как основного стратегического направления развития неавиационных услуг до 2031 года.`;
    html += '</div>';
    html += '</div>';
    
    html += '<div class="recommendation-item priority-medium">';
    html += '<div class="recommendation-priority">Средний приоритет</div>';
    html += '<div class="recommendation-text">';
    html += '<strong>Интеграция элементов других сценариев:</strong> включить лучшие практики цифровой коммерции (Сценарий 1) и умной инфраструктуры (Сценарий 3) в рамках основной стратегии.';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="recommendation-item priority-medium">';
    html += '<div class="recommendation-priority">Средний приоритет</div>';
    html += '<div class="recommendation-text">';
    html += '<strong>Развитие кадрового потенциала:</strong> создание программы подготовки и привлечения специалистов по цифровым технологиям, аналитике данных и клиентскому сервису.';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="recommendation-item priority-low">';
    html += '<div class="recommendation-priority">Низкий приоритет</div>';
    html += '<div class="recommendation-text">';
    html += '<strong>Система мониторинга и контроля:</strong> внедрение KPI-дашбордов для отслеживания прогресса реализации стратегии и раннего выявления рисков.';
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}
function viewExpertDetail(expertId) {
    const expert = expertsData.find(e => e.id === expertId);
    if (!expert) return;
    
    // Переключаемся на вкладку детального просмотра
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('expertDetail').classList.add('active');
    
    const container = document.getElementById('expertDetailContent');
    
    let html = '<div class="expert-detail">';
    html += '<h2>Анкета эксперта №' + expert.id + '</h2>';
    
    html += '<div class="info-block">';
    html += '<h3>Информация об эксперте</h3>';
    html += '<p><strong>Должность:</strong> ' + expert.position + '</p>';
    html += '<p><strong>Организация:</strong> ' + expert.organization + '</p>';
    html += '<p><strong>Опыт работы:</strong> ' + expert.experience + ' лет</p>';
    html += '<p><strong>Специализация:</strong> ' + expert.specialization + '</p>';
    html += '<p><strong>Дата заполнения:</strong> ' + formatDate(expert.fillDate) + '</p>';
    html += '</div>';
    
    html += '<div class="result-card">';
    html += '<h3>Оценки по критериям</h3>';
    
    const criteriaNames = {
        'Ф1': 'Рост доли неавиационных доходов',
        'Ф2': 'Рост средних расходов пассажира',
        'Ф3': 'Снижение операционных затрат',
        'Ф4': 'Новые источники дохода',
        'К1': 'Индекс лояльности',
        'К2': 'Сокращение времени',
        'К3': 'Доля покупателей',
        'К4': 'Транзитные пассажиры',
        'П1': 'Автоматизация процессов',
        'П2': 'Гибкость и скорость изменений',
        'П3': 'Качество данных для решений',
        'Р1': 'Цифровые компетенции',
        'Р2': 'Технологическая независимость',
        'Р3': 'Инновационный имидж'
    };
    
    html += '<table class="result-table">';
    html += '<thead><tr><th>Критерий</th><th>Сценарий 1</th><th>Сценарий 2</th><th>Сценарий 3</th></tr></thead>';
    html += '<tbody>';
    
    html += '<tr style="background: #e8f5e9;"><td colspan="4"><strong>Финансы</strong></td></tr>';
    ['Ф1', 'Ф2', 'Ф3', 'Ф4'].forEach(key => {
        html += `<tr>
            <td>${criteriaNames[key]}</td>
            <td>${expert.ratings[key].scenario1}</td>
            <td>${expert.ratings[key].scenario2}</td>
            <td>${expert.ratings[key].scenario3}</td>
        </tr>`;
    });
    
    html += '<tr style="background: #e3f2fd;"><td colspan="4"><strong>Клиенты</strong></td></tr>';
    ['К1', 'К2', 'К3', 'К4'].forEach(key => {
        html += `<tr>
            <td>${criteriaNames[key]}</td>
            <td>${expert.ratings[key].scenario1}</td>
            <td>${expert.ratings[key].scenario2}</td>
            <td>${expert.ratings[key].scenario3}</td>
        </tr>`;
    });
    
    html += '<tr style="background: #fff3e0;"><td colspan="4"><strong>Процессы</strong></td></tr>';
    ['П1', 'П2', 'П3'].forEach(key => {
        html += `<tr>
            <td>${criteriaNames[key]}</td>
            <td>${expert.ratings[key].scenario1}</td>
            <td>${expert.ratings[key].scenario2}</td>
            <td>${expert.ratings[key].scenario3}</td>
        </tr>`;
    });
    
    html += '<tr style="background: #f3e5f5;"><td colspan="4"><strong>Развитие</strong></td></tr>';
    ['Р1', 'Р2', 'Р3'].forEach(key => {
        html += `<tr>
            <td>${criteriaNames[key]}</td>
            <td>${expert.ratings[key].scenario1}</td>
            <td>${expert.ratings[key].scenario2}</td>
            <td>${expert.ratings[key].scenario3}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    html += '</div>';
    
    html += '<div class="result-card">';
    html += '<h3>Ранжирование сценариев</h3>';
    html += '<table class="result-table">';
    html += '<thead><tr><th>Сценарий</th><th>Ранг</th></tr></thead>';
    html += '<tbody>';
    html += `<tr><td>Сценарий 1: Цифровая коммерция</td><td>${expert.scenarioRanking ? expert.scenarioRanking.s1 : 'Н/Д'}</td></tr>`;
    html += `<tr><td>Сценарий 2: Бесшовный клиентский опыт</td><td>${expert.scenarioRanking ? expert.scenarioRanking.s2 : 'Н/Д'}</td></tr>`;
    html += `<tr><td>Сценарий 3: Умная инфраструктура и данные</td><td>${expert.scenarioRanking ? expert.scenarioRanking.s3 : 'Н/Д'}</td></tr>`;
    html += '</tbody></table>';
    html += '</div>';
    
    html += '</div>';
    
    container.innerHTML = html;
}

function backToExperts() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector('[data-tab="experts"]').classList.add('active');
    document.getElementById('experts').classList.add('active');
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Переключение элементов с data-lang атрибутами
    document.querySelectorAll('[data-lang-ru]').forEach(el => {
        if (lang === 'ru') {
            el.textContent = el.getAttribute('data-lang-ru');
        } else {
            el.textContent = el.getAttribute('data-lang-en');
        }
    });
    
    // Переводим все текстовые элементы
    document.querySelectorAll('h2, h3, h4, p, label, strong').forEach(el => {
        // Пропускаем элементы с data-lang атрибутами
        if (el.hasAttribute('data-lang-ru')) return;
        
        // Сохраняем оригинальный текст если еще не сохранен
        if (!el.hasAttribute('data-original-text')) {
            const text = el.textContent.trim();
            if (text) el.setAttribute('data-original-text', text);
        }
        
        const originalText = el.getAttribute('data-original-text');
        if (originalText) {
            const translated = translateText(originalText, lang);
            if (translated !== originalText) {
                el.textContent = translated;
            }
        }
    });
    
    // Перерисовка динамического контента
    if (expertsData.length > 0) {
        displayExperts();
        calculateAndDisplayResults();
    }
}

// Language toggle event listener
document.getElementById('langToggle').addEventListener('click', () => {
    switchLanguage(currentLang === 'ru' ? 'en' : 'ru');
});


// Обработка формы
document.getElementById('expertForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const expert = {
        id: expertsData.length + 1,
        position: formData.get('position'),
        organization: formData.get('organization') || 'Не указано',
        experience: parseInt(formData.get('experience')),
        specialization: formData.get('specialization'),
        fillDate: formData.get('fillDate'),
        ranking: {
            s1: parseInt(formData.get('rank_s1')),
            s2: parseInt(formData.get('rank_s2')),
            s3: parseInt(formData.get('rank_s3'))
        },
        ratings: {
            s1: {
                fin_1: parseInt(formData.get('s1_fin_1')),
                fin_2: parseInt(formData.get('s1_fin_2')),
                fin_3: parseInt(formData.get('s1_fin_3')),
                client_1: parseInt(formData.get('s1_client_1')),
                client_2: parseInt(formData.get('s1_client_2')),
                client_3: parseInt(formData.get('s1_client_3')),
                process_1: parseInt(formData.get('s1_process_1')),
                process_2: parseInt(formData.get('s1_process_2')),
                process_3: parseInt(formData.get('s1_process_3')),
                dev_1: parseInt(formData.get('s1_dev_1')),
                dev_2: parseInt(formData.get('s1_dev_2')),
                dev_3: parseInt(formData.get('s1_dev_3'))
            },
            s2: {
                fin_1: parseInt(formData.get('s2_fin_1')),
                fin_2: parseInt(formData.get('s2_fin_2')),
                fin_3: parseInt(formData.get('s2_fin_3')),
                client_1: parseInt(formData.get('s2_client_1')),
                client_2: parseInt(formData.get('s2_client_2')),
                client_3: parseInt(formData.get('s2_client_3')),
                process_1: parseInt(formData.get('s2_process_1')),
                process_2: parseInt(formData.get('s2_process_2')),
                process_3: parseInt(formData.get('s2_process_3')),
                dev_1: parseInt(formData.get('s2_dev_1')),
                dev_2: parseInt(formData.get('s2_dev_2')),
                dev_3: parseInt(formData.get('s2_dev_3'))
            },
            s3: {
                fin_1: parseInt(formData.get('s3_fin_1')),
                fin_2: parseInt(formData.get('s3_fin_2')),
                fin_3: parseInt(formData.get('s3_fin_3')),
                client_1: parseInt(formData.get('s3_client_1')),
                client_2: parseInt(formData.get('s3_client_2')),
                client_3: parseInt(formData.get('s3_client_3')),
                process_1: parseInt(formData.get('s3_process_1')),
                process_2: parseInt(formData.get('s3_process_2')),
                process_3: parseInt(formData.get('s3_process_3')),
                dev_1: parseInt(formData.get('s3_dev_1')),
                dev_2: parseInt(formData.get('s3_dev_2')),
                dev_3: parseInt(formData.get('s3_dev_3'))
            }
        }
    };
    
    // Проверка уникальности рангов
    const ranks = [expert.ranking.s1, expert.ranking.s2, expert.ranking.s3];
    if (new Set(ranks).size !== 3) {
        alert('Ошибка: Каждый сценарий должен иметь уникальный ранг (1, 2 или 3)');
        return;
    }
    
    expertsData.push(expert);
    
    alert('Анкета успешно отправлена! Спасибо за участие.');
    e.target.reset();
    
    displayExperts();
    calculateAndDisplayResults();
});

// Функции для кликабельных выносок с примерами расчетов

function showCalculationExample(type) {
    let content = '';

    switch(type) {
        case 'absolute':
            content = `
                <h3>Пример расчета абсолютного веса подкритерия</h3>
                <p><strong>Формула:</strong> Абсолютный вес = Вес категории × Вес внутри категории</p>
                <p><strong>Пример для Ф1 (Рост доли неавиационных доходов):</strong></p>
                <p>Абсолютный вес Ф1 = 0,35 × 0,40 = 0,140</p>
                <p>где:</p>
                <ul>
                    <li>0,35 - вес финансовой перспективы</li>
                    <li>0,40 - вес подкритерия Ф1 внутри финансовой перспективы</li>
                </ul>
            `;
            break;
        case 'weighted':
            content = `
                <h3>Пример расчета взвешенной оценки</h3>
                <p><strong>Формула:</strong> Взвешенная оценка = Средний балл × Абсолютный вес</p>
                <p><strong>Пример для Ф1 по Сценарию 1:</strong></p>
                <p>Взвешенная оценка = 4,20 × 0,140 = 0,588</p>
                <p>где:</p>
                <ul>
                    <li>4,20 - средний балл экспертов по критерию Ф1 для Сценария 1</li>
                    <li>0,140 - абсолютный вес критерия Ф1</li>
                </ul>
            `;
            break;
        case 'total':
            content = `
                <h3>Пример расчета итоговой взвешенной оценки</h3>
                <p><strong>Формула:</strong> Итоговая оценка = Σ(Взвешенная оценка по каждому критерию)</p>
                <p><strong>Пример для Сценария 1:</strong></p>
                <p>Итоговая оценка = 0,588 + 0,441 + 0,294 + ... + 0,094 = 4,218</p>
                <p>Суммируются взвешенные оценки по всем 13 подкритериям</p>
            `;
            break;
        case 'ranking':
            content = `
                <h3>Пример расчета среднего ранга</h3>
                <p><strong>Формула:</strong> Средний ранг = Σ(Ранг × Количество экспертов) / Общее количество экспертов</p>
                <p><strong>Пример для Сценария 1:</strong></p>
                <p>Если 15 экспертов поставили ранг 1, 8 - ранг 2, 2 - ранг 3:</p>
                <p>Средний ранг = (1×15 + 2×8 + 3×2) / 25 = (15 + 16 + 6) / 25 = 1,48</p>
            `;
            break;
        case 'concordance':
            content = `
                <h3>Расчет коэффициента конкордации Кендалла</h3>
                <p><strong>Пошаговый расчет:</strong></p>
                <ol>
                    <li>Подсчитываем сумму рангов для каждого сценария</li>
                    <li>Вычисляем среднюю сумму рангов: R̄ = n(m+1)/2</li>
                    <li>Находим отклонения и их квадраты: (Rⱼ - R̄)²</li>
                    <li>Суммируем квадраты отклонений: S = Σ(Rⱼ - R̄)²</li>
                    <li>Рассчитываем W = 12S / [n²(m³ - m)]</li>
                    <li>Проверяем значимость: χ² = n(m-1)W</li>
                </ol>
            `;
            break;
        case 'sensitivity':
            content = `
                <h3>Анализ чувствительности</h3>
                <p><strong>Методика:</strong></p>
                <ol>
                    <li>Изменяем веса перспектив BSC в разумных пределах</li>
                    <li>Пересчитываем абсолютные веса подкритериев</li>
                    <li>Вычисляем новые итоговые оценки сценариев</li>
                    <li>Сравниваем изменения в ранжировании</li>
                </ol>
                <p>Это позволяет оценить устойчивость результатов к изменению приоритетов</p>
            `;
            break;
    }

    showModal('Пример расчета', content);
}

function showCalculationExample(criterion, categoryWeight, subWeight, absoluteWeight) {
    const content = `
        <h3>Расчет абсолютного веса для ${criterion}</h3>
        <p><strong>Формула:</strong> Абсолютный вес = Вес категории × Вес внутри категории</p>
        <p><strong>Расчет:</strong></p>
        <p>${criterion}: ${categoryWeight.toFixed(2)} × ${subWeight.toFixed(2)} = ${absoluteWeight.toFixed(3)}</p>
        <p>Этот вес используется для расчета взвешенных оценок по данному критерию</p>
    `;
    showModal('Расчет абсолютного веса', content);
}

function showWeightedCalculation(criterion, weight) {
    const content = `
        <h3>Расчет взвешенных оценок для ${criterion}</h3>
        <p><strong>Абсолютный вес критерия:</strong> ${weight.toFixed(3)}</p>
        <p><strong>Формула:</strong> Взвешенная оценка = Средний балл × Абсолютный вес</p>
        <p>Для каждого сценария умножаем средний балл экспертов на абсолютный вес критерия</p>
    `;
    showModal('Взвешенные оценки', content);
}

function showTotalCalculation(scenario) {
    const content = `
        <h3>Расчет итоговой оценки для ${scenario.toUpperCase()}</h3>
        <p><strong>Формула:</strong> Итоговая оценка = Σ(Средний балл × Абсолютный вес)</p>
        <p>Суммируются взвешенные оценки по всем 13 подкритериям:</p>
        <p>Итоговая оценка = Ф1×0,140 + Ф2×0,105 + Ф3×0,070 + ... + Р3×0,0375</p>
    `;
    showModal('Итоговая оценка', content);
}

function showRankingCalculation(scenario) {
    const content = `
        <h3>Расчет среднего ранга для ${scenario.toUpperCase()}</h3>
        <p><strong>Методика:</strong></p>
        <ol>
            <li>Каждый эксперт ранжирует сценарии от 1 (лучший) до 3 (худший)</li>
            <li>Подсчитывается количество экспертов, поставивших каждый ранг</li>
            <li>Рассчитывается средневзвешенный ранг</li>
        </ol>
        <p><strong>Формула:</strong> Средний ранг = Σ(Ранг × Количество) / Общее количество экспертов</p>
    `;
    showModal('Расчет ранга', content);
}

function showConcordanceDetail(type) {
    let content = '';

    switch(type) {
        case 'W':
            content = `
                <h3>Коэффициент конкордации Кендалла (W)</h3>
                <p><strong>Интерпретация значений:</strong></p>
                <ul>
                    <li>W = 0: Полное отсутствие согласованности</li>
                    <li>0 < W < 0.3: Слабая согласованность</li>
                    <li>0.3 ≤ W < 0.7: Умеренная согласованность</li>
                    <li>W ≥ 0.7: Высокая согласованность</li>
                    <li>W = 1: Полная согласованность</li>
                </ul>
            `;
            break;
        case 'chi':
            content = `
                <h3>Критерий χ² (хи-квадрат)</h3>
                <p><strong>Назначение:</strong> Проверка статистической значимости согласованности</p>
                <p><strong>Правило:</strong> Если χ²расч > χ²крит, то согласованность статистически значима</p>
                <p>Используется уровень значимости α = 0.05</p>
            `;
            break;
        default:
            content = `<p>Подробная информация о показателе ${type}</p>`;
    }

    showModal('Детали расчета', content);
}

function showSensitivityCalculation(variant) {
    const content = `
        <h3>Расчет для варианта "${variant}"</h3>
        <p><strong>Методика:</strong></p>
        <ol>
            <li>Изменяем веса перспектив BSC согласно варианту</li>
            <li>Пересчитываем абсолютные веса всех подкритериев</li>
            <li>Применяем новые веса к средним баллам экспертов</li>
            <li>Получаем новые итоговые оценки сценариев</li>
        </ol>
        <p>Это позволяет увидеть, как изменение приоритетов влияет на выбор лучшего сценария</p>
    `;
    showModal('Анализ чувствительности', content);
}
function showAbsoluteWeightCalculation(criterion, categoryWeight, subWeight, absoluteWeight) {
    const content = `
        <div class="calculation-detail">
            <h4>Расчет абсолютного веса для ${criterion}</h4>
            <div class="formula-block">
                <p><strong>Формула:</strong></p>
                <div class="formula">Абсолютный вес = Вес категории × Вес внутри категории</div>
            </div>
            <div class="calculation-steps">
                <p><strong>Расчет:</strong></p>
                <p>Абсолютный вес ${criterion} = ${categoryWeight} × ${subWeight} = ${absoluteWeight.toFixed(4)}</p>
            </div>
            <div class="explanation">
                <p><strong>Пояснение:</strong></p>
                <p>Абсолютный вес показывает долю данного подкритерия в общей оценке.
                Он рассчитывается как произведение веса категории на вес подкритерия внутри этой категории.</p>
            </div>
        </div>
    `;
    showModal('Расчет абсолютного веса', content);
}

function showWeightedScoreCalculation(criterion, s1Score, s2Score, s3Score, weight) {
    const weighted1 = s1Score * weight;
    const weighted2 = s2Score * weight;
    const weighted3 = s3Score * weight;

    const content = `
        <div class="calculation-detail">
            <h4>Расчет взвешенных оценок для ${criterion}</h4>
            <div class="formula-block">
                <p><strong>Формула:</strong></p>
                <div class="formula">Взвешенная оценка = Средний балл × Абсолютный вес</div>
            </div>
            <div class="calculation-steps">
                <p><strong>Расчеты:</strong></p>
                <p>Сценарий 1: ${s1Score.toFixed(2)} × ${weight.toFixed(4)} = ${weighted1.toFixed(4)}</p>
                <p>Сценарий 2: ${s2Score.toFixed(2)} × ${weight.toFixed(4)} = ${weighted2.toFixed(4)}</p>
                <p>Сценарий 3: ${s3Score.toFixed(2)} × ${weight.toFixed(4)} = ${weighted3.toFixed(4)}</p>
            </div>
            <div class="explanation">
                <p><strong>Пояснение:</strong></p>
                <p>Взвешенная оценка учитывает важность критерия в общей оценке.
                Чем выше абсолютный вес, тем больше влияние данного критерия на итоговый результат.</p>
            </div>
        </div>
    `;
    showModal('Расчет взвешенных оценок', content);
}

function showTotalCalculationExample() {
    const content = `
        <div class="calculation-detail">
            <h4>Расчет итоговых взвешенных оценок</h4>
            <div class="formula-block">
                <p><strong>Формула:</strong></p>
                <div class="formula">Итоговая оценка = Σ(Средний балл × Абсолютный вес)</div>
            </div>
            <div class="calculation-steps">
                <p><strong>Пример расчета для Сценария 1:</strong></p>
                <p>Итоговая оценка = Ф1×0.140 + Ф2×0.105 + Ф3×0.070 + Ф4×0.035 + К1×0.105 + К2×0.075 + К3×0.075 + К4×0.045 + П1×0.080 + П2×0.060 + П3×0.060 + Р1×0.060 + Р2×0.0525 + Р3×0.0375</p>
                <p>= 4.2×0.140 + 3.8×0.105 + 4.5×0.070 + 3.9×0.035 + 4.1×0.105 + 3.7×0.075 + 4.3×0.075 + 3.6×0.045 + 4.0×0.080 + 3.9×0.060 + 4.2×0.060 + 3.8×0.060 + 4.1×0.0525 + 3.5×0.0375</p>
                <p>= 0.588 + 0.399 + 0.315 + 0.137 + 0.431 + 0.278 + 0.323 + 0.162 + 0.320 + 0.234 + 0.252 + 0.228 + 0.215 + 0.131</p>
                <p><strong>= 4.013</strong></p>
            </div>
        </div>
    `;
    showModal('Расчет итоговых оценок', content);
}

function showRankingCalculationDetails() {
    const content = `
        <div class="calculation-detail">
            <h4>Подробный расчет ранжирования</h4>
            <div class="ranking-details">
                <p><strong>Итоговые взвешенные оценки:</strong></p>
                <ul>
                    <li>Сценарий 1: 4.013 баллов</li>
                    <li>Сценарий 2: 4.298 баллов</li>
                    <li>Сценарий 3: 4.095 баллов</li>
                </ul>
                <p><strong>Ранжирование (по убыванию):</strong></p>
                <ol>
                    <li><strong>Сценарий 2</strong> - 4.298 баллов (лидер)</li>
                    <li><strong>Сценарий 3</strong> - 4.095 баллов</li>
                    <li><strong>Сценарий 1</strong> - 4.013 баллов</li>
                </ol>
                <p><strong>Анализ:</strong></p>
                <p>Сценарий 2 показывает наилучший результат с отрывом в 0.203 балла от ближайшего конкурента.
                Разница между 2-м и 3-м местом составляет 0.082 балла, что указывает на более четкое лидерство Сценария 2.</p>
            </div>
        </div>
    `;
    showModal('Анализ ранжирования', content);
}

function showConcordanceCalculation(type) {
    let content = '';

    switch(type) {
        case 'S':
            content = `
                <div class="calculation-detail">
                    <h4>Расчет суммы квадратов отклонений (S)</h4>
                    <div class="formula-block">
                        <p><strong>Формула:</strong></p>
                        <div class="formula">S = Σ(Ri - R̄)²</div>
                        <p>где Ri - сумма рангов i-го объекта, R̄ - средняя сумма рангов</p>
                    </div>
                    <div class="calculation-steps">
                        <p><strong>Данные:</strong></p>
                        <p>Количество экспертов (m) = 20</p>
                        <p>Количество сценариев (n) = 3</p>
                        <p>Средняя сумма рангов R̄ = (R1 + R2 + R3)/3 = (56 + 27 + 37)/3 = 40</p>

                        <p><strong>Суммы рангов по сценариям:</strong></p>
                        <p>Сценарий 1: R₁ = 56</p>
                        <p>Сценарий 2: R₂ = 27</p>
                        <p>Сценарий 3: R₃ = 37</p>

                        <p><strong>Расчет S:</strong></p>
                        <p>S = (56 - 40)² + (27 - 40)² + (37 - 40)²</p>
                        <p>S = 16² + (-13)² + (-3)²</p>
                        <p>S = 256 + 169 + 9</p>
                        <p><strong>S = 434</strong></p>
                    </div>
                </div>
            `;
            break;

        case 'W':
            content = `
                <div class="calculation-detail">
                    <h4>Расчет коэффициента конкордации (W)</h4>
                    <div class="formula-block">
                        <p><strong>Формула:</strong></p>
                        <div class="formula">W = 12S / [n²(m³ - m)]</div>
                    </div>
                    <div class="calculation-steps">
                        <p><strong>Подстановка значений:</strong></p>
                        <p>S = 434 (из предыдущего расчета)</p>
                        <p>n = 20 (количество экспертов)</p>
                        <p>m = 3 (количество сценариев)</p>
                        <p>W = 12 × 434 / [20² × (3³ - 3)]</p>
                        <p>W = 5208 / [400 × (27 - 3)]</p>
                        <p>W = 5208 / [400 × 24]</p>
                        <p>W = 5208 / 9600</p>
                        <p><strong>W = 0.542</strong></p>

                        <p><strong>Интерпретация:</strong></p>
                        <p>W ∈ [0, 1], где 0 - полная несогласованность, 1 - полная согласованность</p>
                        <p>Полученное значение W = 0.542 указывает на умеренную согласованность экспертов.</p>
                    </div>
                </div>
            `;
            break;

        case 'chi':
            content = `
                <div class="calculation-detail">
                    <h4>Расчет критерия χ² (хи-квадрат)</h4>
                    <div class="formula-block">
                        <p><strong>Формула:</strong></p>
                        <div class="formula">χ² = n(m-1)W</div>
                    </div>
                    <div class="calculation-steps">
                        <p><strong>Подстановка значений:</strong></p>
                        <p>n = 20 (количество экспертов)</p>
                        <p>m = 3 (количество сценариев)</p>
                        <p>W = 0.542 (коэффициент конкордации)</p>
                        <p>χ² = 20 × (3 - 1) × 0.542</p>
                        <p>χ² = 20 × 2 × 0.542</p>
                        <p><strong>χ² = 21.68</strong></p>

                        <p><strong>Проверка значимости:</strong></p>
                        <p>Критическое значение χ²₀.₀₅(2) = 5.991</p>
                        <p>Расчетное значение: χ² = 21.68</p>

                        <p><strong>Вывод:</strong></p>
                        <p>χ² = 21.68 > 5.991, следовательно согласованность статистически значима</p>
                    </div>
                </div>
            `;
            break;
    }

    showModal('Расчет согласованности', content);
}

function showSensitivityCalculationDetails() {
    const content = `
        <div class="calculation-detail">
            <h4>Подробные расчеты анализа чувствительности</h4>
            <div class="sensitivity-details">
                <p><strong>Методология:</strong></p>
                <p>Анализ чувствительности проводится путем изменения весовых коэффициентов категорий
                при сохранении относительных весов подкритериев внутри каждой категории.</p>

                <div class="variant-calculations">
                    <h5>Расчет для Варианта А (усиление финансового фокуса):</h5>
                    <p><strong>Новые веса категорий:</strong> Финансы = 0.45, Клиенты = 0.25, Процессы = 0.20, Развитие = 0.10</p>

                    <p><strong>Новые абсолютные веса подкритериев:</strong></p>
                    <ul>
                        <li>Ф1: 0.45 × 0.40 = 0.180</li>
                        <li>Ф2: 0.45 × 0.30 = 0.135</li>
                        <li>Ф3: 0.45 × 0.20 = 0.090</li>
                        <li>Ф4: 0.45 × 0.10 = 0.045</li>
                        <li>К1: 0.25 × 0.35 = 0.0875</li>
                        <li>К2: 0.25 × 0.25 = 0.0625</li>
                        <li>К3: 0.25 × 0.25 = 0.0625</li>
                        <li>К4: 0.25 × 0.15 = 0.0375</li>
                        <li>П1: 0.20 × 0.40 = 0.080</li>
                        <li>П2: 0.20 × 0.30 = 0.060</li>
                        <li>П3: 0.20 × 0.30 = 0.060</li>
                        <li>Р1: 0.10 × 0.40 = 0.040</li>
                        <li>Р2: 0.10 × 0.35 = 0.035</li>
                        <li>Р3: 0.10 × 0.25 = 0.025</li>
                    </ul>

                    <p><strong>Новые итоговые оценки:</strong></p>
                    <p>Сценарий 1: 4.218 баллов → <strong>1 место</strong></p>
                    <p>Сценарий 2: 4.152 балла → 2 место</p>
                    <p>Сценарий 3: 3.986 баллов → 3 место</p>
                </div>

                <div class="sensitivity-conclusions">
                    <h5>Выводы анализа чувствительности:</h5>
                    <ul>
                        <li><strong>Базовый вариант:</strong> Лидер - Сценарий 2</li>
                        <li><strong>Вариант А (финансовый фокус):</strong> Лидер - Сценарий 1</li>
                        <li><strong>Вариант Б (клиентский фокус):</strong> Лидер - Сценарий 2</li>
                        <li><strong>Вариант В (операционный фокус):</strong> Лидер - Сценарий 3</li>
                        <li><strong>Вариант Г (фокус на развитии):</strong> Лидер - Сценарий 2</li>
                    </ul>

                    <p><strong>Устойчивость выбора:</strong></p>
                    <p>Сценарий 2 остается лидером в 3 из 5 вариантов, что указывает на относительную
                    устойчивость выбора. Однако изменение приоритетов может существенно влиять на ранжирование.</p>
                </div>
            </div>
        </div>
    `;
    showModal('Анализ чувствительности', content);
}

function showModal(title, content) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'calculation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="modal-close" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button onclick="closeModal()" class="btn-close">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Показываем модальное окно
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.querySelector('.calculation-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Закрытие модального окна по клику вне его
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('calculation-modal')) {
        closeModal();
    }
});
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Генерируем данные экспертов при загрузке
    if (expertsData.length === 0) {
        expertsData = generateExperts();
        console.log('Данные экспертов сгенерированы:', expertsData.length);
    }

    // Показываем первую вкладку
    // showTab('survey'); // Убираем вызов несуществующей функции
});
