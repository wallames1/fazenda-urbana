
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

// Inicializa o Firestore
const db = firebase.firestore();

// Função para registrar o usuário
const registerUser = (email, password, role) => {
    // Verifica se o papel é válido
    if (role !== 'admin' && role !== 'cliente') {
        console.error('Papel inválido');
        alert('Papel inválido!');
        return;
    }

    // Verifica se o e-mail já está em uso
    firebase.auth().fetchSignInMethodsForEmail(email)
        .then((methods) => {
            if (methods.length > 0) {
                alert('Este e-mail já está em uso. Por favor, use outro.');
                return;
            }

            // Cria o usuário no Firebase Authentication
            return firebase.auth().createUserWithEmailAndPassword(email, password);
        })
        .then(userCredential => {
            if (!userCredential) return; // Evita continuar se o usuário já existia

            const user = userCredential.user;

            // Salva o papel do usuário no Firestore
            return db.collection('users').doc(user.uid).set({
                role: role,
                email: email
            });
        })
        .then(() => {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                alert('Este e-mail já está em uso. Por favor, use outro.');
            } else {
                console.error('Erro:', error);
                alert('Ocorreu um erro: ' + error.message);
            }
        });
};

// Exemplo de como capturar os dados do formulário e chamar a função registerUser
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Captura os dados do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    // Valida se as senhas coincidem
    if (password !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Chama a função de registro
    registerUser(email, password, role);
});
