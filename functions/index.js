const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const cors = require('cors')({origin: true});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const firebaseConfig = {
    apiKey: "AIzaSyDA7MraAKldxtVpQZiErWjjxsoID0XbiUs",
    authDomain: "sabana-hack-icesi.firebaseapp.com",
    databaseURL: "https://sabana-hack-icesi.firebaseio.com",
    projectId: "sabana-hack-icesi",
    storageBucket: "sabana-hack-icesi.appspot.com",
    messagingSenderId: "967218337268",
    appId: "1:967218337268:web:1e572e85e5c7befcb155a1",
    measurementId: "G-KH6E9831KG"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
admin.initializeApp();

// POST METHOD (https://us-central1-proyecto-web-km.cloudfunctions.net/loginUser)- Params passed by body
// It allows to log a user via firebase authentication service.
// Params:
//      Email - String,
//      Password - String
exports.loginUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {});
    const email = req.body.email;
    const password = req.body.password;
    let authenticated = false;

    // eslint-disable-next-line promise/always-return,promise/catch-or-return
    await firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
        authenticated = true;
    }).catch((error) => {
        console.log(error.message);
    });

    res.sendStatus((authenticated) ? 200 : 401);
});

// POST METHOD: (https://us-central1-proyecto-web-km.cloudfunctions.net/registerUser) - Params passed by body
// It allows to register a user via firebase authentication service.
// Params:
//      Email - String,
//      Password - String,
//      ifMonitor - Bool,
//      ifStudent - Bool,
//      Name - String,
//      Program - String
exports.registerUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {});
    const email = req.body.email;
    const password = req.body.password;
    const document = req.body.document;
    const name = req.body.name;
    const addres = req.body.addres;
    const phone = req.body.addres;
    const userType = req.body.userType;
    let created = false;

    await admin.auth().createUser({email: email, password: password})
    // eslint-disable-next-line promise/always-return
        .then((response) => {
            admin.firestore().collection('users').add(
                {
                    email: email,
                    document: document,
                    name: name,
                    addres: addres,
                    phone: phone,
                    userType: userType
                }
            );
            created = true;
        })
        .catch((error) => {
            console.log(error.message);
        });

    res.sendStatus((created) ? 200 : 503);
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
