import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"; // Certifique-se de importar o initializeApp
import { getFirestore, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZIfKr3rs9mOXngpF7MmcKcvXmVZZmoXw",
    authDomain: "react-auth-8b03f.firebaseapp.com",
    projectId: "react-auth-8b03f",
    storageBucket: "react-auth-8b03f.firebasestorage.app",
    messagingSenderId: "292708542740",
    appId: "1:292708542740:web:d3724402e30e8ff9aafa01"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para atualizar a quantidade do produto no Firestore
async function updateProductQuantityInFirestore(productName, quantityPurchased) {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    querySnapshot.forEach(async (docSnap) => {
        const product = docSnap.data();

        if (product.name === productName) {
            const newQuantity = product.quantity - quantityPurchased;
            const productRef = doc(db, "products", docSnap.id);

            // Atualiza a quantidade do produto no Firestore
            if (newQuantity <= 0) {
                await deleteDoc(productRef); // Remove o produto se a quantidade for zero ou negativa
            } else {
                await updateDoc(productRef, { quantity: newQuantity }); // Atualiza a quantidade
            }
            console.log(`Produto ${productName} atualizado no Firestore.`);
        }
    });
}

// Referências para elementos da página
const cartGrid = document.getElementById('cartGrid'); // Refatorando para usar o id correto
const totalPriceElement = document.getElementById('totalPrice'); // Elemento para mostrar o total

// Carrega os produtos do carrinho do localStorage
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cartGrid');

    if (!cartContainer) {
        console.error('Elemento cartGrid não encontrado!');
        return;
    }

    cartContainer.innerHTML = ''; // Limpa o container antes de adicionar os itens

    let total = 0; // Inicializa o total como 0

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço: R$${item.price.toFixed(2)}</p>
            <button class="remove-from-cart" data-index="${index}">Remover</button>
        `;
        cartContainer.appendChild(itemElement);

        // Calcula o total do pedido
        total += item.price * item.quantity;
    });

    // Exibe o total do pedido na tela
    totalPriceElement.textContent = `R$${total.toFixed(2)}`;

    // Adiciona o evento para remover itens
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

// Função para remover item do carrinho
function removeItemFromCart(event) {
    const index = event.target.getAttribute('data-index'); // Pega o índice do item
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1); // Remove o item do array

    // Atualiza o carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Atualiza a interface
    loadCartItems();
}

// Carrega os itens ao abrir a página
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
});

// Finalizar a compra e atualizar no Firestore
async function finalizePurchase() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Verifica se há itens no carrinho
    if (cartItems.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Atualiza a quantidade no Firestore para cada item do carrinho
    for (const item of cartItems) {
        const quantityPurchased = item.quantity;

        // Atualiza a quantidade no Firestore
        await updateProductQuantityInFirestore(item.name, quantityPurchased);
    }

    // Exibe o alerta de compra realizada
    alert("Compra realizada com sucesso!"); // Alerta que a compra foi realizada

    // Limpa o localStorage após a compra
    localStorage.removeItem('cart'); // Limpa o carrinho após a compra

    // Redireciona para a página de checkout ou agradecimento
    window.location.href = '/inicio.html'; // Redireciona para a página de checkout
}

// Evento de finalizar compra
document.getElementById('confirmPurchaseBtn').addEventListener('click', finalizePurchase);
