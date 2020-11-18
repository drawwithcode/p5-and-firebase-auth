// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyBylT2XZz-CdbUHxbnU2lggOkMPdR7MH5Y",
  authDomain: "p5-test-project-2617f.firebaseapp.com",
  databaseURL: "https://p5-test-project-2617f.firebaseio.com",
  projectId: "p5-test-project-2617f",
  storageBucket: "p5-test-project-2617f.appspot.com",
  messagingSenderId: "663615500974",
  appId: "1:663615500974:web:24adf95954a8a2de44733f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// enable auth
// https://firebase.google.com/docs/auth/web/google-signin
let user = "";
let provider = new firebase.auth.GoogleAuthProvider();

firebase
  .auth()
  .signInWithPopup(provider)
  .then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;
    // ...
  })
  .catch(function (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    const credential = error.credential;
    // ...
  });

// initialise database
let database = firebase.database();

// connect to records named letters
let dbConnection = database.ref("letters");

// when new data is available run the callback function named "gotData"
dbConnection.on("value", gotData, gotError);
// create an empty array which we will use to store data
let loadedLetters = {};

function gotData(data) {
  if (data != null) {
    loadedLetters = data.val();
  }
  console.log("new data", loadedLetters);
}

function gotError(err) {
  console.log(err);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode("DEGREES");
  // put setup code here

  console.log(firebase);
  background("yellow");
}

const fontFaces = [
  "Arial",
  "Courer New",
  "Georgia",
  "Times New Roman",
  "Trebuchet MS",
];

function draw() {
  console.log(user.uid);
  // put drawing code here
  if (loadedLetters != null) {
    let keys = Object.keys(loadedLetters);

    background("yellow");

    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let letter = loadedLetters[k];
      let fontFace = random(fontFaces);

      push();
      textFont(letter.font);
      fill(letter.color);
      translate(letter.x, letter.y);
      rotate(letter.rotation + frameCount / 100);
      textSize(letter.size);
      text(letter.letter, 0, 0);
      pop();
    }
  }
}

const colorNames = ["red", "blue", "green", "pink", "silver", "azure"];

function keyTyped() {
  //define properties
  const xPos = random(windowWidth);
  const yPos = random(windowHeight);
  const size = random(10, 50);
  const myColor = random(colorNames);
  const rotation = random(360);
  const font = random(fontFaces);

  console.log(myColor);

  // Send the data to database
  // write an entry with the username key
  // in this way we are sure that every user can store only
  // one information
  dbConnection.child(user.uid).set({
    x: xPos,
    y: yPos,
    size: size,
    color: myColor,
    rotation: rotation,
    letter: key,
    font: font,
    user: user.uid,
  });
}
