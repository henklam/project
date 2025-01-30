import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, addDoc, collection, getDocs, serverTimestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

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
const db = getFirestore(app);

const weightInput = document.getElementById("weight");
const submitButton = document.getElementById("submit");

const weightCollection = collection(db, "weight");
const dateCollection = collection(db, "date");

async function addWeightToDB(value, user) {
    try {
        const date = new Date();
        const docRef1 = await addDoc(collection(db, "weight"), {
            weight: value,
            uid: user.uid,
            timestamp: serverTimestamp()
        });
        const docRef2 = await addDoc(collection(db, "date"), {
            date: (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear(),
            uid: user.uid,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function addWeightClicked() {
    const value = weightInput.value;
    const user = auth.currentUser;
    if(value) {
        addWeightToDB(value, user)
        .then(() => {
            createGraph();
        })
        weightInput.value = "";
    }
}

submitButton.addEventListener("click", addWeightClicked);

async function fetchWeight() {
    try {
        const weightQuery = query(weightCollection, orderBy("timestamp"));
        const querySnapshot = await getDocs(weightQuery);
        const weightList = [];
        querySnapshot.forEach((doc) => {
            weightList.push(doc.data());
        });
        return weightList;
    } catch (e) {
        console.error("Error fetching documents:", e);
    }
}

async function fetchDate() {
    try {
        const dateQuery = query(dateCollection, orderBy("timestamp"));
        const querySnapshot = await getDocs(dateQuery);
        const dateList = [];
        querySnapshot.forEach((doc) => {
            dateList.push(doc.data());
        });
        return dateList;
    } catch (e) {
        console.error("Error fetching documents:", e);
    }
}

async function fetchData() {
    try {
        const fetchedWeightList = await fetchWeight();
        const fetchedDateList = await fetchDate();
        return { weightList: fetchedWeightList, dateList: fetchedDateList };
    } catch (e) {
        console.error("Error fetching data:", e);
        return { weightList: [], dateList: [] };
    }
}

let chartInstance = null;
async function createGraph() {
    const { weightList, dateList } = await fetchData();
    const dates = dateList.map(doc => doc.date);
    const weights = weightList.map(doc => doc.weight);
    const ctx = document.getElementById("graph");
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "WEIGHT",
                data: weights,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false 
                }
            }
        }
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if(localStorage.getItem("refresh") != null) {
            signOut(auth).then(() => {
                localStorage.removeItem("refresh");
                document.location.href = "index.html";
            }).catch((error) => {
                console.error(error);
            });
        } else {
            localStorage.setItem("refresh", "false");
        }
        createGraph();
    } else {
        document.location.href = "index.html";
    }
});