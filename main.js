// Valores de conversión
const conversionRates = {
    "USD": 2300,
    "EUR": 3000,
    "BRL": 1800,
    "GBP": 3800
};

// Inicializar carrito desde localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar la interfaz del carrito
const updateCartUI = () => {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = cart.map((item, index) => 
        `<li>${item.amount} pesos = ${item.convertedAmount} ${item.currency} <button onclick="removeFromCart(${index})">Cancelar</button></li>`
    ).join('');
}

// Agregar la conversión al carrito
const addToCart = (amount, convertedAmount, currency) => {
    cart.push({ amount, convertedAmount, currency });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Eliminar un item del carrito
const removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Mostrar las tasas de cambio en la interfaz
const displayExchangeRates = () => {
    const exchangeRatesDiv = document.getElementById('exchangeRates');
    exchangeRatesDiv.innerHTML = `
        <p>Dólar (USD): $${conversionRates.USD} por USD</p>
        <p>Euro (EUR): $${conversionRates.EUR} por EUR</p>
        <p>Real (BRL): $${conversionRates.BRL} por BRL</p>
        <p>Libra (GBP): $${conversionRates.GBP} por GBP</p>
    `;
}

// Manejar la conversión
document.getElementById('convertBtn').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    
    if (isNaN(amount) || amount <= 0) {
        Swal.fire('Error', 'Por favor ingresa una cantidad válida.', 'error');
        return;
    }

    // Simular una solicitud AJAX para obtener la tasa de cambio
    const conversionRate = await fetchConversionRate(currency);

    const convertedAmount = (amount / conversionRate).toFixed(2);

    document.getElementById('conversionResult').innerText = `${amount} pesos = ${convertedAmount} ${currency}`;

    addToCart(amount, convertedAmount, currency);
});

// Simular obtención de tasas de cambio usando fetch
const fetchConversionRate = (currency) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(conversionRates[currency]);
        }, 500); // Simulación de demora de red
    });
};

// Confirmar la transacción simulada
document.getElementById('confirmBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire('Carrito vacío', 'No hay transacciones que confirmar.', 'warning');
        return;
    }

    Swal.fire('Compra Confirmada', 'Tus conversiones han sido confirmadas.', 'success');
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
});

// Inicializar la página mostrando las tasas y actualizando el carrito
displayExchangeRates();
updateCartUI();
