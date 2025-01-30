import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3hSG2MpJnTMz5JUg2mDOs6bjto5FAGuc",
    authDomain: "project-a2fe0.firebaseapp.com",
    projectId: "project-a2fe0",
    storageBucket: "project-a2fe0.firebasestorage.app",
    messagingSenderId: "1076386198963",
    appId: "1:1076386198963:web:d489780981a4bff56807c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

var user = document.getElementById("user");
var pass = document.getElementById("pass");
var button = document.getElementById("sign-in");

function getUser() {
    return user.value    
}
function getPass() {
    return pass.value
}

function signIn() {
    let user = getUser();
    let pass = getPass();
    signInWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
            document.location.href = "app.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}

button.addEventListener("click", signIn);


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('project/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
  