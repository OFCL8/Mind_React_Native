import React from "react";

import * as firebase from 'firebase';
import HomeLeaderScreen from "./HomeLeaderScreen";
import HomeClientScreen from "./HomeClientScreen";
import HomeCTOScreen from "./HomeCTOScreen";
import LoadingScreen from "./LoadingScreen";

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Home',
  };

  constructor(props){
    super(props);
    //Checks for role of current user
    firebase.auth().onAuthStateChanged((user)=>{
      if(user != null){
        var user = firebase.auth().currentUser;
        var uid;
        uid = user.uid;
        firebase.firestore().doc(`Users/${ uid }`).onSnapshot(doc=>{ 
          this.setState({role:  doc.get("Role")}) //Setting role state value of current user role
          switch(this.state.role)
          {
            case "CTO":
              { this.setState({"redirectTo": "HomeCTO"}); }
              break;
            case "Leader":
              { this.setState({"redirectTo": "HomeLeader"}); }
              break;
            case "Client":
              { this.setState({"redirectTo": "HomeClient"}); }
              break;
          }
      });
      }
      else
      {
        this.setState({"redirectTo": "Loading"});
      }
    })
    
  }
  state = {
    role: "",
    redirectTo: ""
  };

  render() {
    if (this.state.redirectTo === 'HomeCTO') {
      return <HomeCTOScreen />
    }
    else if (this.state.redirectTo === 'HomeLeader') {
      return <HomeLeaderScreen />
    }
    else if (this.state.redirectTo === 'HomeClient') {
      return <HomeClientScreen />
    }
    else {
      return <LoadingScreen/>
    }
  }
}