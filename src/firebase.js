import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBZQRzYqGmc4Pd-rs9WEkEW404uqu16V9o",
    authDomain: "advent-calendar-quiz.firebaseapp.com",
    projectId: "advent-calendar-quiz",
    storageBucket: "advent-calendar-quiz.appspot.com",
    messagingSenderId: "354860330931",
    appId: "1:354860330931:web:133525ddcbcf6e511465c6",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
