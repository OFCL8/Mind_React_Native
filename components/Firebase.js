import * as firebase from 'firebase';

// Your web app's Firebase configuration
  const firebaseConfig = {
  apiKey: "AIzaSyAwPfrJaJTW_Q5ipzJKmE9wxyzoojAG0RE",
  authDomain: "mindreactnative.firebaseapp.com",
  databaseURL: "https://mindreactnative.firebaseio.com",
  projectId: "mindreactnative",
  storageBucket: "mindreactnative.appspot.com",
  messagingSenderId: "156896962944",
  appId: "1:156896962944:web:0283c154297ac766fab965"
};
export default class Firebase {
 
  static auth;
  static init() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    Firebase.auth = firebase.auth();
  }
}

export const settings = { timestampsInSnapShots: true };
 