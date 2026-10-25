document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. КАЛЬКУЛЯТОР СТОИМОСТИ =================
    const areaInput = document.getElementById('area');
    const repairTypeSelect = document.getElementById('repair-type');
    const calcBtn = document.getElementById('calc-btn');
    const totalPriceElement = document.getElementById('total-price');

    const prices = {
        cosmetic: 5000,
        capital: 9000,
        design: 15000
    };

    function formatPrice(number) {
        return new Intl.NumberFormat('ru-RU').format(number) + ' ₽';
    }

    function calculateCost() {
        let area = parseFloat(areaInput.value);
        if (isNaN(area) || area < 1) {
            area = 1; 
        }
        const type = repairTypeSelect.value;
        const pricePerMeter = prices[type];
        const total = area * pricePerMeter;
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

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // ================= 3. МОДАЛЬНОЕ ОКНО И ВАЛИДАЦИЯ =================
    const modal = document.getElementById('callback-modal');
    const openBtnHeader = document.getElementById('open-modal-btn');
    const openBtnHero = document.getElementById('open-modal-btn-hero');
    const closeBtn = document.getElementById('close-modal-btn');
    const form = document.getElementById('callback-form');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');

    // Функция открытия окна
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Блокируем скролл фона
        }
    }

    // Функция закрытия окна
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (form) form.reset(); // Очищаем поля формы
            if (phoneError) phoneError.textContent = '';
            if (phoneInput) phoneInput.classList.remove('error');
        }
    }

    // Слушатели для открытия
    if (openBtnHeader) openBtnHeader.addEventListener('click', openModal);
    if (openBtnHero) openBtnHero.addEventListener('click', openModal);

    // Слушатели для закрытия (по крестику и клику на темный фон)
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Отменяем перезагрузку страницы
            
            const phoneValue = phoneInput.value.trim();
            // Регулярное выражение: проверяем, что введено от 10 до 18 символов (цифры, пробелы, скобки, дефис)
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,18}$/;

            if (!phoneRegex.test(phoneValue)) {
                phoneInput.classList.add('error');
                phoneError.textContent = 'Пожалуйста, введите корректный номер телефона (минимум 10 цифр).';
                return;
            }

            // Если всё верно
            phoneInput.classList.remove('error');
            phoneError.textContent = '';
            
            // Меняем текст кнопки на время "отправки"
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            // Имитация успешной отправки (через 1.5 секунды)
            setTimeout(() => {
                modal.querySelector('.modal__content').innerHTML = `
                    <div style="text-align: center; padding: 20px 0;">
                        <div style="font-size: 50px; margin-bottom: 15px;">✅</div>
                        <h3 style="margin-bottom: 10px;">Заявка принята!</h3>
                        <p style="color: #555;">Мы перезвоним вам в ближайшее время.</p>
                        <button class="btn btn--primary" id="success-close-btn" style="margin-top: 20px;">Отлично</button>
                    </div>
                `;
                
                // Добавляем обработчик для кнопки "Отлично" на экране успеха
                const successBtn = document.getElementById('success-close-btn');
                if (successBtn) {
                    successBtn.addEventListener('click', closeModal);
                }
            }, 1500);
        });
    }
});