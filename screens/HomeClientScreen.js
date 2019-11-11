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

    this.setState({ email });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi {this.state.email}!</Text>

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