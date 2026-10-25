document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. КАЛЬКУЛЯТОР СТОИМОСТИ =================
    const areaInput = document.getElementById('area');
    const repairTypeSelect = document.getElementById('repair-type');
    const calcBtn = document.getElementById('calc-btn');
    const totalPriceElement = document.getElementById('total-price');

    const prices = { cosmetic: 5000, capital: 9000, design: 15000 };

    function formatPrice(number) {
        return new Intl.NumberFormat('ru-RU').format(number) + ' ₽';
    }

    function calculateCost() {
        let area = parseFloat(areaInput.value);
        if (isNaN(area) || area < 1) area = 1; 
        const type = repairTypeSelect.value;
        const total = area * prices[type];
        totalPriceElement.textContent = formatPrice(total);
    }

    if (calcBtn) calcBtn.addEventListener('click', calculateCost);
    if (repairTypeSelect) repairTypeSelect.addEventListener('change', calculateCost);

    // ================= 2. ПЛАВНЫЙ СКРОЛЛ =================
    const navLinks = document.querySelectorAll('.nav__link, .hero .btn');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault(); 
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // ================= 3. МОДАЛЬНОЕ ОКНО И ОТПРАВКА ФОРМЫ =================
    const modal = document.getElementById('callback-modal');
    const openBtnHeader = document.getElementById('open-modal-btn');
    const openBtnHero = document.getElementById('open-modal-btn-hero');
    const closeBtn = document.getElementById('close-modal-btn');
    const form = document.getElementById('callback-form');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Не сбрасываем форму сразу, чтобы пользователь видел экран успеха
        }
    }

    if (openBtnHeader) openBtnHeader.addEventListener('click', openModal);
    if (openBtnHero) openBtnHero.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Отменяем перезагрузку страницы
            
            const phoneValue = phoneInput.value.trim();
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,18}$/;

            // Валидация
            if (!phoneRegex.test(phoneValue)) {
                phoneInput.classList.add('error');
                phoneError.textContent = 'Пожалуйста, введите корректный номер телефона (минимум 10 цифр).';
                return;
            }

            phoneInput.classList.remove('error');
            phoneError.textContent = '';
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            // Собираем данные и отправляем в Formspree
            const formData = new FormData(form);

            fetch('https://formspree.io/f/mbggdvkv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Успех!
                    modal.querySelector('.modal__content').innerHTML = `
                        <div style="text-align: center; padding: 20px 0;">
                            <div style="font-size: 50px; margin-bottom: 15px;">✅</div>
                            <h3 style="margin-bottom: 10px;">Заявка принята!</h3>
                            <p style="color: #555;">Мы перезвоним вам в ближайшее время.</p>
                            <button class="btn btn--primary" id="success-close-btn" style="margin-top: 20px;">Отлично</button>
                        </div>
                    `;
                    // Обработчик для кнопки "Отлично"
                    document.getElementById('success-close-btn').addEventListener('click', () => {
                        closeModal();
                        // Восстанавливаем исходную форму через 0.5 сек, чтобы при следующем открытии она была на месте
                        setTimeout(() => {
                            window.location.reload(); 
                        }, 500);
                    });
                } else {
                    submitBtn.textContent = 'Ошибка. Попробуйте еще раз';
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                submitBtn.textContent = 'Ошибка сети';
                submitBtn.disabled = false;
            });
        });
    }

    // ================= 4. ПАНЕЛЬ ДОСТУПНОСТИ =================
    
    // 4.1 Смена темы
    const btnTheme = document.getElementById('btn-theme');
    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            btnTheme.textContent = document.body.classList.contains('dark-theme') ? '☀️ Тема' : '🌙 Тема';
        });
    }

    // 4.2 Версия для слабовидящих
    const btnVisual = document.getElementById('btn-visual');
    if (btnVisual) {
        btnVisual.addEventListener('click', () => {
            document.body.classList.toggle('visual-impairment');
        });
    }

    // 4.3 Озвучивание текста по наведению
    const btnSpeak = document.getElementById('btn-speak');
    let speakModeActive = false;
    let hoverTimeout; 

    if (btnSpeak) {
        btnSpeak.addEventListener('click', () => {
            speakModeActive = !speakModeActive;
            
            if (speakModeActive) {
                btnSpeak.textContent = '🔇 Выключить озвучку';
                btnSpeak.style.background = 'var(--primary-color)';
                btnSpeak.style.color = 'white';
                document.body.style.cursor = 'help'; 
            } else {
                btnSpeak.textContent = '🔊 Озвучить';
                btnSpeak.style.background = '';
                btnSpeak.style.color = '';
                document.body.style.cursor = 'default';
                window.speechSynthesis.cancel(); 
            }
        });
    }

    function readElementText(element) {
        const text = element.innerText.trim();
        if (!text) return;
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }

    if (btnSpeak) {
        const textElements = document.querySelectorAll('h1, h2, h3, p, .step, .portfolio-card__info, .calculator__result');
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (speakModeActive) {
                    hoverTimeout = setTimeout(() => {
                        readElementText(el);
                    }, 600); 
                }
            });
            el.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        });
    }

    // 4.4 Перевод на английский
    const btnLang = document.getElementById('btn-lang');
    let isEnglish = false;
    const translatableElements = document.querySelectorAll('[data-en]');
    const originalTexts = new Map();
    translatableElements.forEach(el => {
        originalTexts.set(el, el.innerHTML);
    });

    if (btnLang) {
        btnLang.addEventListener('click', () => {
            isEnglish = !isEnglish;
            translatableElements.forEach(el => {
                if (isEnglish) {
                    el.innerHTML = el.getAttribute('data-en');
                } else {
                    el.innerHTML = originalTexts.get(el);
                }
            });
            btnLang.textContent = isEnglish ? '🇷🇺 RU' : '🇬🇧 EN';
        });
    }
});