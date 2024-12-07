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
firebase.initializeApp(firebaseConfig);

// Referência ao Firebase Authentication
const auth = firebase.auth();

// Função para enviar o e-mail de recuperação de senha
const sendPasswordResetEmail = (email) => {
    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
            window.location.href = 'login.html'; // Redireciona para a página de login após o envio
        })
        .catch((error) => {
            console.error('Erro ao enviar e-mail de recuperação:', error);
            alert('Ocorreu um erro ao tentar enviar o e-mail de recuperação: ' + error.message);
        });
};

// Captura o formulário e adiciona o evento de submissão
document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtém o valor do e-mail inserido no formulário
    const email = document.getElementById('email').value;

    // Valida o e-mail
    if (email === '') {
        alert('Por favor, insira seu e-mail.');
        return;
    }

    // Chama a função para enviar o e-mail de recuperação
    sendPasswordResetEmail(email);
});
