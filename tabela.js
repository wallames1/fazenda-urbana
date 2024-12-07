let currentTableIndex = 0; 
const tables = document.querySelectorAll(".table");
const tableTitle = document.getElementById("table-2");

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZIfKr3rs9mOXngpF7MmcKcvXmVZZmoXw",
    authDomain: "react-auth-8b03f.firebaseapp.com",
    projectId: "react-auth-8b03f",
    storageBucket: "react-auth-8b03f.firebasestorage.app",
    messagingSenderId: "292708542740",
    appId: "1:292708542740:web:d3724402e30e8ff9aafa01"
};
// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Obtenha a referência do Firestore
const db = firebase.firestore();

// Função para carregar os produtos do Firestore
function loadProducts() {
    console.log("Carregando produtos do Firestore...");

    const tableBody = document.getElementById("product-table-body");

    if (!tableBody) {
        console.log("Erro: elemento 'product-table-body' não encontrado!");
        return;
    }

    // Limpar tabela antes de preencher
    tableBody.innerHTML = "";

    // Buscar os produtos do Firestore
    db.collection("products")  // Coleção chamada "products"
        .get()
        .then(querySnapshot => {
            console.log(querySnapshot.size);  // Log para verificar o número de documentos encontrados

            if (querySnapshot.empty) {
                console.log("Nenhum produto encontrado!");
            }

            // Para cada produto, criamos uma nova linha na tabela
            querySnapshot.forEach(doc => {
                const product = doc.data();  // Dados do produto

                console.log(product);  // Log para ver os dados do produto

                const row = document.createElement("tr");

                // Criando as células para cada produto
                const nameCell = document.createElement("td");
                nameCell.textContent = product.name;

                const valueCell = document.createElement("td");
                valueCell.textContent = `R$ ${product.price.toFixed(2)}`;  // Exibindo o preço formatado

                const unitsCell = document.createElement("td");
                unitsCell.textContent = product.quantity;

                // Adicionando as células à linha da tabela
                row.appendChild(nameCell);
                row.appendChild(valueCell);
                row.appendChild(unitsCell);

                // Adicionando a linha na tabela
                tableBody.appendChild(row);
            });

            console.log("Produtos carregados do Firestore!");
        })
        .catch(error => {
            console.error("Erro ao carregar produtos do Firestore:", error);
        });
}

// Chama a função para carregar os produtos quando a página for carregada
document.addEventListener("DOMContentLoaded", loadProducts);

// Script para abrir e fechar a sidebar
const sidebar = document.querySelector('.sidebar');
const toggleSidebar = () => {
    sidebar.classList.toggle('open');
};

// Exemplo de como adicionar um botão para abrir a sidebar em dispositivos móveis
const openSidebarButton = document.querySelector('.open-sidebar-button');
openSidebarButton.addEventListener('click', toggleSidebar);
