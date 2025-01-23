const tg = window.Telegram.WebApp;
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

// Основные функции
function showStartScreen() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    updateCartCounter();
}

function showCategories() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="categories-menu">
            ${Object.entries(products).map(([key, items]) => `
                <button class="main-btn shop-btn" onclick="showCategory('${key}')">
                    ${getCategoryTitle(key)}
                </button>
            `).join('')}
        </div>
    `;
}

function showCategory(category) {
    const items = products[category];
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="product-list">
            ${items.map(item => `
                <div class="product-card">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>💵 ${item.price.toLocaleString()} ₽</p>
                    <button class="main-btn shop-btn" onclick="addToCart(${item.id})">
                        🛒 Добавить в корзину
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// Функции корзины
function addToCart(productId) {
    const allProducts = Object.values(products).flat();
    const product = allProducts.find(p => p.id === productId);
    cart.push(product);
    updateCartCounter();
    tg.showAlert(`✅ "${product.name}" добавлен в корзину!`);
}

function showCart() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="cart-content">
            <h2>🛒 Корзина</h2>
            ${cart.map((item, index) => `
                <div class="product-card">
                    <h3>${item.name}</h3>
                    <p>${item.price.toLocaleString()} ₽</p>
                    <button class="main-btn shop-btn" onclick="removeFromCart(${index})">
                        ❌ Удалить
                    </button>
                </div>
            `).join('')}
            ${cart.length > 0 ? `
                <button class="main-btn shop-btn" onclick="checkout()">
                    💳 Оформить заказ (${cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()} ₽)
                </button>
            ` : '<p>Корзина пуста</p>'}
        </div>
    `;
}

function checkout() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="order-form">
            <h2>📦 Оформление заказа</h2>
            <form onsubmit="submitOrder(event)">
                <input class="main-btn" type="tel" id="phone" placeholder="+7 (999) 123-45-67" required>
                <textarea class="main-btn" id="address" placeholder="Адрес доставки" required></textarea>
                <button type="submit" class="main-btn shop-btn">✅ Подтвердить</button>
            </form>
        </div>
    `;
}

function submitOrder(event) {
    event.preventDefault();
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    const orderData = {
        phone: phone,
        address: address,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    tg.sendData(JSON.stringify({
        message: `Новый заказ!\nТелефон: ${phone}\nАдрес: ${address}\nТовары: ${cart.map(i => i.name).join(', ')}\nИтого: ${orderData.total}₽`,
        recipient: '@SSmig'
    }));
    
    cart = [];
    tg.showAlert("✅ Заказ оформлен! Мы свяжемся с вами в течение 15 минут.");
    tg.close();
}

// Вспомогательные функции
function getCategoryTitle(key) {
    const titles = {
        drones: '🚁 Дроны',
        propellers: '🌀 Пропеллеры',
        merch: '👕 Мерч',
        batteries: '🔋 Аккумуляторы'
    };
    return titles[key] || 'Категория';
}

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.innerHTML = `🛒 Корзина (${cart.length})`;
    }
}

// Инициализация
tg.ready();
tg.expand();
showStartScreen();
