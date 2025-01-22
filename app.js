// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Ваши товары (позже можно заменить на данные с сервера)
const products = [
    { id: 1, name: "Крутая футболка", price: 999 },
    { id: 2, name: "Модные кроссовки", price: 1999 }
];

// Показ товаров
function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = products.map(product => `
        <div class="product">
            <h3>${product.name}</h3>
            <p>Цена: ${product.price}₽</p>
            <button onclick="addToCart(${product.id})">В корзину</button>
        </div>
    `).join('');
}

// Корзина (в реальном проекте используйте localStorage или сервер)
let cart = [];

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    tg.showAlert(`Товар "${product.name}" добавлен в корзину!`);
}

// Отправка данных боту
function checkout() {
    tg.sendData(JSON.stringify(cart));
}

// Инициализация приложения
tg.ready();
renderProducts();
// ... (предыдущий код с категориями и корзиной)

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
    // Ваш существующий код отображения категорий
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="categories-menu">
            <button class="category-btn" onclick="showCategory('drones')">🚁 Дроны</button>
            <button class="category-btn" onclick="showCategory('propellers')">🌀 Пропеллеры</button>
            <button class="category-btn" onclick="showCategory('merch')">👕 Мерч</button>
            <button class="category-btn" onclick="showCategory('batteries')">🔋 Аккумуляторы</button>
        </div>
    `;
}

function showFlightInfo() {
    showMainContent();
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="flight-info">
            <h2>Авиационный клуб "wazup! fly"</h2>
            <img src="drone-pilot.png" alt="Пилот">
            <p>🎯 Обучение пилотированию с нуля</p>
            <p>🏆 Профессиональные инструкторы</p>
            <p>🌍 Полетные зоны по всему миру</p>
            <button 
                class="main-btn fly-btn"
                onclick="window.open('https://t.me/your_flight_bot')"
                style="margin-top: 20px;"
            >
                🚀 Записаться на полет
            </button>
        </div>
    `;
}

// Инициализация
tg.ready();
tg.expand();
showStartScreen(); // Показываем стартовый экран при загрузке