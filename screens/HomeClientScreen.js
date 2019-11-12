import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

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

  registerForPushNotificationsAsync = async() => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
    try {
      // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    firebase.firestore().doc(`Users/${ this.currentUser.uid}`).set({push_token:token});
    firebase.database().ref('users/'+this.currentUser.uid+'/push_token').set(token);
    console.log(token);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  async componentDidMount() {
    const { email } = firebase.auth().currentUser;

    this.setState({ email });
    this.currentUser = await this.email;
    await this.registerForPushNotificationsAsync();
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