import * as firebase from 'firebase';

// Your web app's Firebase configuration
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAILjr3lHU1uDpN0u_-g4dAN_h6FCNgB9A",
    authDomain: "mindreactnative-76991.firebaseapp.com",
    databaseURL: "https://mindreactnative-76991.firebaseio.com",
    projectId: "mindreactnative-76991",
    storageBucket: "mindreactnative-76991.appspot.com",
    messagingSenderId: "354780949033",
    appId: "1:354780949033:web:c49345ca0859a332df0a38"
};

export default class Firebase {
 
  static init() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}


 