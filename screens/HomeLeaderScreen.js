import React from 'react';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';
import { withNavigation } from 'react-navigation';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const { width, height } = Dimensions.get('window');

import * as firebase from 'firebase';

class HomeLeaderScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    role: ""
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };

  addClient = () => {
    this.props.navigation.navigate("AddClient");
  }
  
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
    if (finalStatus !== 'granted') { return; }
    try {
      // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    let uid = firebase.auth().currentUser.uid;
    firebase.firestore().doc(`Users/${ uid }`).update({push_token:token});
    firebase.database().ref('users/'+ uid +'/push_token').set(token);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  async componentDidMount() {
    const { email } = firebase.auth().currentUser;

    this.setState({ email });
    await this.registerForPushNotificationsAsync();
  }

  sendPushNotification = () => {
    let response = fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        to: 'ExponentPushToken[PNP63bG3O588iAN-Dp3hh4]',
        sound: 'default',
        title: 'Demo',
        body: 'Demo'
      })
    });
  };

  render() {
    return (

      <View style={styles.container}>
          <Text style={styles.title}>Hi {this.state.email}</Text>
          <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
            <Text style={{fontSize:0}}>+</Text>
          </TouchableOpacity>
          <Button title="Send push notification" onPress={()=>this.sendPushNotification}/>
          <TouchableOpacity onPress={this.signOutUser}>
            <Text >LogOut</Text>
          </TouchableOpacity>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
    marginBottom: 10
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
    paddingTop: 20
  },
  addbutton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 60,
    bottom: height - 850,
    height: 60,
    justifyContent: 'center',
    left: width - 100,
    shadowOpacity: 0.2,
    position: 'relative',
    width: 60
  }
});

export default withNavigation(HomeLeaderScreen);