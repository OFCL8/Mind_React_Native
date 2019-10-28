import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import * as firebase from 'firebase';

export default class HomeClientScreen extends React.Component {

  state = {
    email: "",
    currentUser: "", 
    role: ""
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };

  componentWillMount() {
    const { email } = firebase.auth().currentUser;

    //Checks for role of current user
    const currentUser = firebase.auth().currentUser.uid;
    firebase.firestore().doc(`Users/${ currentUser }`).onSnapshot(doc=>{ 
      this.setState({role:  doc.get("Role")}) //Setting role state value of current user role
      switch(this.state.role)
      {
        case "CTO":
          { this.props.navigation.navigate("HomeClient"); }
          break;
        case "Leader":
          { this.props.navigation.navigate("HomeLeader"); }
          break;
        case "Client":
          { this.props.navigation.navigate("HomeClient"); }
          break;
      }
  });

    this.setState({ email });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi {this.state.email}, you're a {this.state.role}!</Text>

        <TouchableOpacity style={{marginTop: 32}} onPress={this.signOutUser}>
          <Text>LogOut</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});