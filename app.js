const tg = window.Telegram.WebApp;

const categories = {
    all: {
        title: "Весь ассортимент",
        items: []
    },
    drones: {
        title: "Дроны",
        items: [
            { id: 1, name: "DJI Mavic 3 Pro", price: 249999, description: "Профессиональный дрон с камерой Hasselblad" },
            { id: 2, name: "Autel Evo Lite+", price: 189999, description: "4K дрон с ночной съемкой" },
            { id: 3, name: "Hubsan Zino Pro", price: 45999, description: "Компактный дрон начального уровня" }
        ]
    },
    propellers: {
        title: "Пропеллеры",
        items: [
            { id: 4, name: "Carbon 9450", price: 2999, description: "Углеродные пропеллеры для DJI" },
            { id: 5, name: "Plastic 8345", price: 999, description: "Базовые пропеллеры для начинающих" },
            { id: 6, name: "Folding 7032", price: 1999, description: "Складные пропеллеры для путешествий" }
        ]
    },
    merch: {
        title: "Мерч",
        items: [
            { id: 7, name: "Кепка Pilot", price: 1499, description: "Дышащая бейсболка с логотипом" },
            { id: 8, name: "Толстовка Drone", price: 3999, description: "Теплая худи для полетов" },
            { id: 9, name: "Брелок DJI", price: 499, description: "Металлический брелок-дрон" }
        ]
    },
    batteries: {
        title: "Аккумуляторы",
        items: [
            { id: 10, name: "Smart Battery Pro", price: 15999, description: "Интеллектуальная батарея 6000mAh" },
            { id: 11, name: "FlyPower X3", price: 8999, description: "Компактный аккумулятор для путешествий" },
            { id: 12, name: "UltraFlight 10000", price: 22999, description: "Мощная батарея для длительных полетов" }
        ]
    }
};

// Заполняем весь ассортимент
categories.all.items = Object.values(categories)
    .filter(c => c.title !== "Весь ассортимент")
    .flatMap(c => c.items);

let cart = [];

function showStartScreen() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

function showMainContent() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function showCategories() {
    showMainContent();
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

function showCategory(categoryKey) {
    const category = categories[categoryKey];
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <h2>${category.title}</h2>
        <div class="product-list">
            ${category.items.map(item => `
                <div class="product-card">
                    <h3 class="product-title">${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Цена: ${item.price.toLocaleString()}₽</p>
                    <button class="main-btn shop-btn" onclick="addToCart(${item.id})">В корзину</button>
                </div>
            `).join('')}
        </div>
    `;
}

function showFlightInfo() {
    showMainContent();
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="flight-info">
            <h2>Авиационный клуб "wazup! fly"</h2>
            <p>🎯 Обучение пилотированию с нуля</p>
            <p>🏆 Профессиональные инструкторы</p>
            <p>🌍 Полетные зоны по всему миру</p>
            <button 
                class="main-btn fly-btn"
                onclick="window.open('https://t.me/wazup_crew_bot')"
                style="margin-top: 20px;"
            >
                🚀 Записаться на полет
            </button>
        </div>
    `;
}

// Остальные функции (addToCart, showCart и т.д.) остаются аналогичными предыдущей версии

// Инициализация
tg.ready();
tg.expand();
showStartScreen();
// ... (предыдущий код с категориями)


function addToCart(productId) {
    const allItems = Object.values(categories)
        .filter(c => c.title !== "Весь ассортимент")
        .flatMap(c => c.items);
    
    const product = allItems.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);
    updateCartCounter();
    tg.showAlert(`✅ "${product.name}" добавлен в корзину!`);
    
    // Анимация кнопки корзины
    const cartBtn = document.querySelector('.nav-btn:last-child');
    cartBtn.style.animation = 'buttonPulse 0.5s ease';
    setTimeout(() => cartBtn.style.animation = '', 500);
}

function showCart() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>🛒 Ваша корзина</h2>
        ${cart.length === 0 
            ? '<p>Корзина пуста</p>' 
            : cart.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.price.toLocaleString()}₽</p>
                    </div>
                    <button 
                        class="nav-btn" 
                        onclick="removeFromCart(${index})"
                        style="background: #ff4444; padding: 8px 15px;"
                    >
                        Удалить
                    </button>
                </div>
            `).join('')}
        ${cart.length > 0 ? `
            <div class="total-price">
                <h3>Итого: ${cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}₽</h3>
                <button class="main-btn" onclick="checkout()">Оформить заказ</button>
            </div>
        ` : ''}
    `;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
    updateCartCounter();
}

function updateCartCounter() {
    const cartButton = document.querySelector('footer button:nth-child(2)');
    if (cartButton) {
        cartButton.innerHTML = `Корзина (${cart.length})`;
    }
}

// ... остальные функции

// Инициализация
tg.ready();
tg.expand();
tg.setHeaderColor('#aaffaa'); // Устанавливаем цвет шапки
tg.setBackgroundColor('#aaffaa'); // Устанавливаем цвет фона
showStartScreen();