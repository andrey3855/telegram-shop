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