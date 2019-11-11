import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation } from 'react-navigation';

import * as firebase from 'firebase';

class HomeCTOScreen extends React.Component {

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
export default withNavigation(HomeCTOScreen);