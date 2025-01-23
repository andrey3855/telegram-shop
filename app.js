const tg = window.Telegram.WebApp;
let currentView = 'start';
let cart = [];

const products = {
    drones: [
        { id: 1, name: "DJI Mavic 3", price: 249999, description: "Профессиональный дрон 4K" },
        { id: 2, name: "Autel Evo II", price: 189999, description: "Дрон с тепловизором" },
        { id: 3, name: "Hubsan Zino", price: 45999, description: "Компактный для начинающих" }
    ],
    propellers: [
        { id: 4, name: "Carbon 9450", price: 2999, description: "Пропеллеры из карбона" },
        { id: 5, name: "Plastic 8345", price: 999, description: "Бюджетные пластиковые" },
        { id: 6, name: "Folding 7032", price: 1999, description: "Складные для транспортировки" }
    ],
    merch: [
        { id: 7, name: "Кепка Pilot", price: 1499, description: "Стильная бейсболка" },
        { id: 8, name: "Толстовка Drone", price: 3999, description: "Теплая худи" },
        { id: 9, name: "Брелок DJI", price: 499, description: "Металлический аксессуар" }
    ],
    batteries: [
        { id: 10, name: "Smart Battery", price: 15999, description: "Интеллектуальная батарея" },
        { id: 11, name: "FlyPower X3", price: 8999, description: "Компактный вариант" },
        { id: 12, name: "UltraFlight", price: 22999, description: "Для длительных полетов" }
    ]
};

function showStartScreen() {
    currentView = 'start';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    updateCartCounter();
}

function showMainContent() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function showCategories() {
    showMainContent();
    currentView = 'categories';
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="categories-menu">
            <button class="category-btn" onclick="showCategory('all')">🌟 Весь ассортимент</button>
            <button class="category-btn" onclick="showCategory('drones')">🚁 Дроны</button>
            <button class="category-btn" onclick="showCategory('propellers')">🌀 Пропеллеры</button>
            <button class="category-btn" onclick="showCategory('merch')">👕 Мерч</button>
            <button class="category-btn" onclick="showCategory('batteries')">🔋 Аккумуляторы</button>
        </div>
    `;
}

function showCategory(category) {
    currentView = category;
    const items = category === 'all' 
        ? Object.values(products).flat() 
        : products[category];
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2 class="category-title">${getCategoryTitle(category)}</h2>
        <div class="product-list">
            ${items.map(item => `
                <div class="product-card">
                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-description">${item.description}</p>
                    <p class="product-price">💵 ${item.price.toLocaleString()} ₽</p>
                    <button 
                        class="main-btn shop-btn" 
                        onclick="addToCart(${item.id})"
                    >
                        🛒 Добавить в корзину
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function getCategoryTitle(category) {
    const titles = {
        all: 'Весь ассортимент',
        drones: 'Дроны',
        propellers: 'Пропеллеры',
        merch: 'Фирменный мерч',
        batteries: 'Аккумуляторы'
    };
    return titles[category] || 'Категория';
}

function addToCart(productId) {
    const allProducts = Object.values(products).flat();
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        cart.push(product);
        updateCartCounter();
        tg.showAlert(`✅ "${product.name}" добавлен в корзину!`);
        animateCartButton();
    }
}

function animateCartButton() {
    const cartBtn = document.querySelector('.cart-counter');
    cartBtn.classList.add('pulse');
    setTimeout(() => cartBtn.classList.remove('pulse'), 500);
}

function showCart() {
    currentView = 'cart';
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="cart-content">
            <h2 class="cart-title">🛒 Ваша корзина</h2>
            ${cart.length === 0 
                ? '<p class="empty-cart">Корзина пуста</p>' 
                : cart.map((item, index) => `
                    <div class="cart-item">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <p class="price">${item.price.toLocaleString()} ₽</p>
                        </div>
                        <button 
                            class="nav-btn" 
                            onclick="removeFromCart(${index})"
                            style="background: #ff7675;"
                        >
                            ❌ Удалить
                        </button>
                    </div>
                `).join('')}
            ${cart.length > 0 ? `
                <div class="total-section">
                    <h3>Итого: ${calculateTotal().toLocaleString()} ₽</h3>
                    <button class="main-btn shop-btn" onclick="checkout()">
                        💳 Оформить заказ
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCounter();
    showCart();
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.innerHTML = `🛒 Корзина ${cart.length > 0 ? `(${cart.length})` : ''}`;
    }
}

function checkout() {
    if (cart.length === 0) {
        tg.showAlert("Корзина пуста!");
        return;
    }
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="order-form">
            <h2>📦 Оформление заказа</h2>
            <form onsubmit="submitOrder(event)">
                <div class="form-group">
                    <label>Telegram @</label>
                    <input type="text" id="telegram" required pattern="@\w+">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" id="phone" required pattern="\+7\d{10}">
                </div>
                <div class="form-group">
                    <label>Адрес доставки</label>
                    <textarea id="address" required></textarea>
                </div>
                <button type="submit" class="main-btn shop-btn">
                    ✅ Подтвердить заказ
                </button>
            </form>
        </div>
    `;
}

function submitOrder(event) {
    event.preventDefault();
    const telegram = document.getElementById('telegram').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    const orderData = {
        user: { telegram, phone, address },
        items: cart,
        total: calculateTotal()
    };

    const message = `📦 Новый заказ!\n\n` +
        `👤 Клиент: ${telegram}\n` +
        `📱 Телефон: ${phone}\n` +
        `🏠 Адрес: ${address}\n\n` +
        `🛒 Товары:\n${cart.map(i => `• ${i.name} - ${i.price.toLocaleString()}₽`).join('\n')}\n\n` +
        `💰 Итого: ${orderData.total.toLocaleString()}₽`;

    tg.sendData(JSON.stringify({
        message: message,
        recipient: '@SSmig'
    }));
    
    cart = [];
    updateCartCounter();
    tg.showAlert("✅ Заказ успешно оформлен! Мы свяжемся с вами в Telegram.");
    tg.close();
}

function showFlightInfo() {
    currentView = 'flights';
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="flight-info">
            <h2>🚁 Авиаклуб "wazup! fly"</h2>
            <div class="flight-features">
                <p>🎯 Профессиональное обучение</p>
                <p>🏅 Сертифицированные инструкторы</p>
                <p>🌏 Полетные зоны по всему миру</p>
            </div>
            <button 
                class="main-btn fly-btn" 
                onclick="window.open('https://t.me/wazup_crew_bot')"
            >
                ✈️ Записаться на полет
            </button>
        </div>
    `;
}

tg.ready();
tg.expand();
tg.enableClosingConfirmation();
showStartScreen();
function checkout() {
    if (cart.length === 0) {
        tg.showAlert("Корзина пуста!");
        return;
    }
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="order-form">
            <h2 style="color: #2d3436; text-align: center; margin-bottom: 30px;">🚚 Данные для доставки</h2>
            
            <div class="order-summary" style="
                background: #ff7675;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 30px;
                color: white;
            ">
                <h3>Ваш заказ (${cart.length} товаров)</h3>
                <p>💰 Итого: ${calculateTotal().toLocaleString()} ₽</p>
            </div>

            <form id="orderForm" onsubmit="submitOrder(event)">
                <div class="form-group">
                    <input 
                        type="tel" 
                        id="phone" 
                        class="form-input"
                        placeholder="+7 (999) 123-45-67"
                        required
                        pattern="\+7\s?[\(]?[0-9]{3}[\)]?\s?\d{3}[-]?\d{2}[-]?\d{2}"
                    >
                    <div class="form-note">Пример: +7 (999) 123-45-67</div>
                </div>

                <div class="form-group">
                    <textarea 
                        id="address" 
                        class="form-input"
                        rows="3"
                        placeholder="Введите полный адрес доставки"
                        required
                        style="resize: none; height: 120px;"
                    ></textarea>
                    <div class="form-note">Город, улица, дом, квартира</div>
                </div>

                <button 
                    type="submit" 
                    class="main-btn shop-btn"
                    style="width: 100%; margin-top: 20px; font-size: 1.2rem;"
                >
                    🚀 Подтвердить заказ
                </button>
            </form>
        </div>
    `;
}

function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const phone = form.querySelector('#phone').value;
    const address = form.querySelector('#address').value;

    // Валидация телефона
    const phonePattern = /^\+7\s?[\(]?[0-9]{3}[\)]?\s?\d{3}[-]?\d{2}[-]?\d{2}$/;
    if (!phonePattern.test(phone)) {
        form.querySelector('#phone').classList.add('error');
        return;
    }

    // Валидация адреса
    if (address.trim().length < 15) {
        form.querySelector('#address').classList.add('error');
        return;
    }

    // Формирование сообщения
    const message = `📦 Новый заказ!\n\n` +
        `📱 Телефон: ${phone}\n` +
        `🏠 Адрес: ${address}\n\n` +
        `🛒 Товары:\n${cart.map(item => `• ${item.name} - ${item.price.toLocaleString()}₽`).join('\n')}\n\n` +
        `💰 Итого: ${calculateTotal().toLocaleString()}₽`;

    // Отправка данных
    tg.sendData(JSON.stringify({
        message: message,
        recipient: '@SSmig'
    }));
    
    // Очистка корзины
    cart = [];
    updateCartCounter();
    
    // Уведомление пользователю
    tg.showAlert("✅ Заказ успешно оформлен! Курьер свяжется с вами в течение 15 минут.");
    tg.close();
}
