// Importa o Firebase e configurações
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZIfKr3rs9mOXngpF7MmcKcvXmVZZmoXw",
    authDomain: "react-auth-8b03f.firebaseapp.com",
    projectId: "react-auth-8b03f",
    storageBucket: "react-auth-8b03f.firebasestorage.app",
    messagingSenderId: "292708542740",
    appId: "1:292708542740:web:d3724402e30e8ff9aafa01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seleciona os elementos necessários
const addProductBtn = document.getElementById('addProductBtn');
const productFormContainer = document.getElementById('productFormContainer');
const productForm = document.getElementById('productForm');
const productGrid = document.getElementById('productGrid');

// Exibe o formulário ao clicar
addProductBtn.addEventListener('click', () => {
    console.log("Botão de adicionar produto clicado"); // Para verificar
    productFormContainer.style.display = productFormContainer.style.display === 'none' ? 'block' : 'none';
});

// Converte imagem em Base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Função para salvar no Firestore
async function saveProductToFirestore(name, imageFile, quantity, price) {
    const imageSrc = await convertImageToBase64(imageFile);

    try {
        const docRef = await addDoc(collection(db, "products"), {
            name,
            imageSrc,
            quantity,
            price
        });
        console.log("Produto salvo com sucesso no Firestore!");
        displayProduct(docRef.id, name, imageSrc, quantity, price); // Atualiza o grid com o novo produto
    } catch (e) {
        console.error("Erro ao adicionar produto: ", e);
    }
}

// Exibe produto no grid e adiciona o evento de remoção
function displayProduct(id, name, imageSrc, quantity, price) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
        <button class="delete-btn" title="Remover produto">X</button>
        <img src="${imageSrc}" alt="${name}">
        <h3>${name}</h3>
        <p>Quantidade: ${quantity}</p>
        <p>Preço: R$${price.toFixed(2)}</p>
    `;

    // Adiciona o evento de exclusão
    const deleteBtn = productCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        removeProductFromFirestore(id, productCard);
    });

    productGrid.appendChild(productCard);
}

// Função para remover o produto do Firestore
async function removeProductFromFirestore(id, productCard) {
    try {
        await deleteDoc(doc(db, "products", id));
        console.log("Produto removido com sucesso!");
        productGrid.removeChild(productCard); // Remove o produto da interface
    } catch (e) {
        console.error("Erro ao remover produto: ", e);
    }
}

// Carrega os produtos do Firestore
async function loadProductsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        displayProduct(doc.id, product.name, product.imageSrc, product.quantity, product.price);
    });
}

// Processa envio do formulário
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const imageFile = document.getElementById('image').files[0];
    const quantity = document.getElementById('quantity').value;
    const price = parseFloat(document.getElementById('price').value);

    await saveProductToFirestore(name, imageFile, quantity, price);
    productForm.reset();
    productFormContainer.style.display = 'none';
});

// Carrega os produtos ao iniciar
window.addEventListener('load', loadProductsFromFirestore);
