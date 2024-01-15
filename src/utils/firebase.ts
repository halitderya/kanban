import { Card } from "@/types/cardtype";
import { initializeApp } from "firebase/app";
import { getDatabase, set,ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAvcM7f1RCGd8qmqZbbb1kMNdL0FDmE-4g",
    authDomain: "kanban-31191.firebaseapp.com",
    databaseURL: "https://kanban-31191-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kanban-31191",
    storageBucket: "kanban-31191.appspot.com",
    messagingSenderId: "1094664664537",
    appId: "1:1094664664537:web:4b1d3a5a9acd4f666895c8"
};

const app = initializeApp(firebaseConfig);



export  const db = getDatabase(app);
