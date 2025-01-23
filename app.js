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
            <button class="category-btn" onclick="showCategory('all')">🌟 Весь ассортимент</button>
            <button class="category-btn" onclick="showCategory('drones')">🚁 Дроны</button>
            <button class="category-btn" onclick="showCategory('propellers')">🌀 Пропеллеры</button>
            <button class="category-btn" onclick="showCategory('merch')">👕 Мерч</button>
            <button class="category-btn" onclick="showCategory('batteries')">🔋 Аккумуляторы</button>
        </div>
    `;
}

function showCategory(category) {
    const items = category === 'all' 
        ? Object.values(products).flat() 
        : products[category];
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>${getCategoryTitle(category)}</h2>
        <div class="product-list">
            ${items.map(item => `
                <div class="product-card">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>💵 ${item.price.toLocaleString()} ₽</p>
                    <button class="main-btn shop-btn" onclick="addToCart(${item.id})">
                        🛒 Добавить
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

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
            <h2>🛒 Ваша корзина</h2>
            ${cart.length === 0 
                ? '<p>Корзина пуста</p>' 
                : cart.map((item, index) => `
                    <div class="cart-item">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${item.price.toLocaleString()} ₽</p>
                        </div>
                        <button class="nav-btn" onclick="removeFromCart(${index})">
                            ❌ Удалить
                        </button>
                    </div>
                `).join('')}
            ${cart.length > 0 ? `
                <button class="main-btn shop-btn" onclick="checkout()">
                    💳 Оформить (${cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()} ₽)
                </button>
            ` : ''}
        </div>
    `;
}

function checkout() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="order-form">
            <h2>📦 Оформление заказа</h2>
            <form onsubmit="submitOrder(event)">
                <div class="form-group">
                    <label>Ваш Telegram @</label>
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
        telegram,
        phone,
        address,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    tg.sendData(JSON.stringify({
        message: `Новый заказ!\n\nКлиент: ${telegram}\nТелефон: ${phone}\nАдрес: ${address}\nТовары: ${cart.map(i => i.name).join(', ')}\nИтого: ${orderData.total}₽`,
        recipient: '@SSmig'
    }));
    
    cart = [];
    updateCartCounter();
    tg.showAlert("Заказ оформлен! Мы свяжемся с вами в Telegram.");
    tg.close();
}

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = `🛒 Корзина (${cart.length})`;
    }
}

tg.ready();
tg.expand();
showStartScreen();
