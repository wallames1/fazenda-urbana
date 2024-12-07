import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";


// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZIfKr3rs9mOXngpF7MmcKcvXmVZZmoXw",
    authDomain: "react-auth-8b03f.firebaseapp.com",
    projectId: "react-auth-8b03f",
    storageBucket: "react-auth-8b03f.firebasestorage.app",
    messagingSenderId: "292708542740",
    appId: "1:292708542740:web:d3724402e30e8ff9aafa01"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const productGrid = document.getElementById('productGrid');

// Exibe o produto com a opção de adicionar ao carrinho
function displayProduct(name, imageSrc, quantity, price) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
        <img src="${imageSrc}" alt="${name}">
        <h3>${name}</h3>
        <p>Quantidade disponível: ${quantity}</p>
        <p>Preço: R$${price.toFixed(2)}</p>
        <input type="number" class="quantity-input" min="1" max="${quantity}" value="1">
        <button class="add-to-cart-btn">Adicionar ao Carrinho</button>
    `;

    productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        const selectedQuantity = parseInt(productCard.querySelector('.quantity-input').value);
        if (selectedQuantity > 0 && selectedQuantity <= quantity) {
            addToCart({ name, imageSrc, quantity: selectedQuantity, price });
            alert(`${selectedQuantity} x ${name} adicionados ao carrinho!`);
        } else {
            alert("Por favor, insira uma quantidade válida.");
        }
    });

    productGrid.appendChild(productCard);
}

// Adiciona o produto ao carrinho no localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        // Atualiza a quantidade do produto no carrinho se ele já existir
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Adiciona um novo produto ao carrinho
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Exibe o carrinho ao usuário (simplificado)
function viewCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
    } else {
        const cartSummary = cart.map(item => `${item.quantity} x ${item.name} - R$${(item.price * item.quantity).toFixed(2)}`).join("\n");
        alert(`Carrinho:\n${cartSummary}`);
    }
}

// Carrega produtos do Firestore e os exibe no catálogo
async function loadProductsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        displayProduct(product.name, product.imageSrc, product.quantity, product.price);
    });
}

// Carrega os produtos ao iniciar a página
window.addEventListener('load', loadProductsFromFirestore);

// Verifica a autenticação do usuário e seu papel
const checkUserRole = async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Busca o papel do usuário no Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userRole = userData.role; // Obtém o papel (role)

                    // Referência aos elementos de navegação
                    const plantacoesNav = document.getElementById('plantacoes-nav');
                    const tabelaNav = document.getElementById('tabela-nav');

                    // Esconde os elementos se o usuário não for "admin"
                    if (userRole !== 'admin') {
                        if (plantacoesNav) plantacoesNav.style.display = 'none';
                        if (tabelaNav) tabelaNav.style.display = 'none';
                    }
                } else {
                    console.error("Usuário não encontrado no Firestore.");
                }
            } catch (error) {
                console.error("Erro ao buscar papel do usuário:", error);
            }
        } else {
            console.log("Usuário não autenticado.");
        }
    });
};

// Verifica o papel do usuário quando a página é carregada
window.addEventListener('load', checkUserRole);

