// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

// Variáveis para armazenar dados de gráficos
let productNames = [];
let productQuantities = [];
let productPrices = [];

// Função para carregar produtos e organizar dados
async function loadProductsForCharts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        productNames.push(product.name);
        productQuantities.push(product.quantity);
        productPrices.push(product.price);
    });

    // Inicializa os gráficos após carregar os dados
    initCharts();
}

// Chamado ao carregar a página
window.addEventListener('load', loadProductsForCharts);

// Função para inicializar os gráficos
function initCharts() {
    // Gráfico grande - Quantidade de cada produto
    const ctxLarge = document.getElementById('largeChart').getContext('2d');
    new Chart(ctxLarge, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Quantidade dos Produtos',
                data: productQuantities,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico pequeno 1 - Quantidade total de produtos
    const ctxSmall1 = document.getElementById('smallChart1').getContext('2d');
    new Chart(ctxSmall1, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                data: productQuantities,
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Gráfico pequeno 2 - Preço de cada produto
    const ctxSmall2 = document.getElementById('smallChart2').getContext('2d');
    new Chart(ctxSmall2, {
        type: 'line',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Preço dos Produtos',
                data: productPrices,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
