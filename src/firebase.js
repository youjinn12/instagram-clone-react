import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBgSEQPRQnqr8yJvCleWEXlUO9KRh5P03E",
    authDomain: "instagram-clone-react-3d1f6.firebaseapp.com",
    projectId: "instagram-clone-react-3d1f6",
    storageBucket: "instagram-clone-react-3d1f6.appspot.com",
    messagingSenderId: "821304779418",
    appId: "1:821304779418:web:d7a4cfda537331ed743523",
    measurementId: "G-EM7EPCF81F"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
// const storage = firebase.storage();
const storage = firebase.storage();

export {db, auth, storage};