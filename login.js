// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZIfKr3rs9mOXngpF7MmcKcvXmVZZmoXw",
    authDomain: "react-auth-8b03f.firebaseapp.com",
    projectId: "react-auth-8b03f",
    storageBucket: "react-auth-8b03f.firebasestorage.app",
    messagingSenderId: "292708542740",
    appId: "1:292708542740:web:d3724402e30e8ff9aafa01"
};
//inicializa firebase
firebase.initializeApp(firebaseConfig);



// Captura o formulário de login
const form = document.getElementById('loginForm');
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que a página seja recarregada

    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    // Realiza o login com o Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(Response => {
            console.log('Usuário autenticado', Response);

            // Agora buscamos o papel do usuário no Firestore
            const user = firebase.auth().currentUser;
            const db = firebase.firestore();

            db.collection('users').doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userRole = doc.data().role; // Obtém o papel do usuário
                        console.log('Papel do usuário:', userRole);

                        // Redireciona com base no papel do usuário
                        if (userRole === 'admin') {
                            window.location.href = 'adicionar-produtos.html'; // Página de administração
                        } else {
                            window.location.href = 'inicio.html'; // Página do cliente
                        }
                    } else {
                        console.error('Não foi possível encontrar dados do usuário no Firestore');
                        alert('Erro ao carregar dados do usuário');
                    }
                })
                .catch(error => {
                    console.error('Erro ao recuperar dados do usuário:', error);
                    alert('Erro ao fazer login');
                });
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('E-mail ou senha incorretos!');
        });
});

firebase.firestore().settings({
    persistence: false
  });
  const db = firebase.firestore();
  db.enablePersistence()
      .catch((err) => {
          if (err.code === 'failed-precondition') {
              console.log("Persistência offline falhou");
          } else if (err.code === 'unimplemented') {
              console.log("Persistência offline não suportada");
          }
      });
    