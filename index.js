
// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZIfKr3rs9mOXngpF7MmcKcvXmVZZmoXw",
    authDomain: "react-auth-8b03f.firebaseapp.com",
    projectId: "react-auth-8b03f",
    storageBucket: "react-auth-8b03f.firebasestorage.app",
    messagingSenderId: "292708542740",
    appId: "1:292708542740:web:d3724402e30e8ff9aafa01"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// API e elementos do DOM para exibir dados climáticos
const apiKey = "39d0ad6c2ebf37c0e4884379a44540e1";
const apiCountryURL = "https://countryflagsapi.com/png/";

// Referências aos elementos do DOM
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");

// Exibe informações de fonte de alimentação (exemplo dinâmico)
const powerStatusElement = document.getElementById("power-status");
const batteryLevelElement = document.getElementById("battery-level");

// Histórico do clima
const historyElement = document.getElementById("weather-history");
let weatherHistory = [];

// Função para obter dados do clima
const getWeatherData = async (city) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    const res = await fetch(apiWeatherURL);
    const data = await res.json();
    return data;
};

// Função para exibir dados do clima
const showWeatherData = async (city) => {
    if (!cityElement || !tempElement || !descElement || !weatherIconElement || !humidityElement || !windElement) {
        console.error("Um ou mais elementos necessários para exibir o clima não foram encontrados.");
        return;
    }

    const data = await getWeatherData(city);
    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed} km/h`;

    // Adiciona o clima atual ao histórico
    updateWeatherHistory(data);
    weatherContainer.classList.remove("hide");
};

// Função para simular status de fonte de alimentação
const updatePowerSource = () => {
    if (powerStatusElement && batteryLevelElement) {
        powerStatusElement.querySelector("span").innerText = "Ligado à corrente elétrica";
        batteryLevelElement.querySelector("span").innerText = "85%";
    } else {
        console.error("Elementos de status de energia não encontrados no DOM.");
    }
};

// Função para atualizar o histórico de clima
const updateWeatherHistory = (data) => {
    if (weatherHistory.length >= 5) weatherHistory.pop(); // Limita o histórico a 5 itens
    weatherHistory.unshift({
        city: data.name,
        temperature: parseInt(data.main.temp),
        description: data.weather[0].description
    });
    renderWeatherHistory();
};

// Função para exibir o histórico no HTML
const renderWeatherHistory = () => {
    if (historyElement) {
        historyElement.innerHTML = "";
        weatherHistory.forEach(entry => {
            const li = document.createElement("li");
            li.innerText = `${entry.city}: ${entry.temperature}°C, ${entry.description}`;
            historyElement.appendChild(li);
        });
    } else {
        console.error("Elemento de histórico de clima não encontrado.");
    }
};

// Verificar a autenticação do usuário e papel
const checkUserRole = async () => {
    const user = firebase.auth().currentUser;

    if (user) {
        // Se o usuário estiver autenticado, busca o papel no Firestore
        const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const userRole = userData.role; // Obtém o papel (role)

            const addProductsBtn = document.getElementById('add-products-btn');

            if (addProductsBtn) {
                if (userRole !== 'admin') {
                    addProductsBtn.style.display = 'none';  // Esconde o botão se não for admin
                }
            } else {
                console.error("Botão 'Adicionar Produto' não encontrado.");
            }
        } else {
            console.error("Usuário não encontrado no Firestore.");
        }
    } else {
        console.log("Usuário não autenticado.");
    }
};



// Verificar a autenticação do usuário sempre que houver uma mudança no estado
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        checkUserRole();  // Verifica o papel do usuário após o login ou carregamento
    } else {
        console.log("Usuário não autenticado");
    }
});

// Inicializa o DOM quando a página estiver carregada
window.addEventListener("DOMContentLoaded", () => {
    showWeatherData("Santos");  // Exibe clima inicial para a cidade de "Santos"
    updatePowerSource();        // Atualiza informações da fonte de alimentação
});
