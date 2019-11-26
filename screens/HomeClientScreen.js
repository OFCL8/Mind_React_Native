import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import { NavigationEvents, withNavigation } from "react-navigation";
import LoadingScreen from "./LoadingScreen";
var surveyName;

class HomeClientScreen extends React.Component {

  constructor(props){
    super(props);
  }

  state = {
    email: "",
    company: '',
    name: '',
    currentUser: "", 
    role: "",
    newSurveys: false,
    clientDetails: {},
    survey: {},
    trigger: false,
    loading: true,
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };

  async componentDidMount() {
    var currentUser = await firebase.auth().currentUser.uid;
    db = firebase.firestore();
    await this.registerForPushNotificationsAsync();
    
    const userData = await db.collection('Users')
    .doc(String(currentUser))
    .get()
    .then((doc) => {
      if(doc.exists){
        this.setState({
          clientDetails: doc.data(),
          currentUser: currentUser,
        });
        this.setState({
          loading: false,
        });
      }
      else
        console.log('User not found');
    })
    .catch((error) => {
      console.log('Error getting document: ' , error);
    });

    const surveyData = await db.collection('leaderSurvey')
    .doc(String(this.state.clientDetails.Company+this.state.clientDetails.Name))
    .get()
    .then((doc) => {
      if(doc.exists){
        this.setState({
          name: String(this.state.clientDetails.Company+this.state.clientDetails.Name),
          newSurveys: !doc.get('answered'),
          survey: doc.data(),
        });
      } else {
        console.log('No new surveys :{');
      }
    })
    .catch((error) => {
      console.log('Could not connect to firebase: ', error)
    });
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
    if (finalStatus !== 'granted') {
      return;
    }
    try {
      // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    firebase.firestore().doc(`Users/${ this.currentUserLog }`).update({push_token:token});
    firebase.database().ref('users/'+ this.currentUserLog +'/push_token').set(token);
    console.log(token);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  surveyDone = () => {
    db.collection('leaderSurvey').doc(this.state.name).get().then((doc) => {
      this.setState({ newSurveys: !doc.get('answered') });
    });
  }

  answerSurvey = async () => {
    this.props.navigation.navigate("ClientSurvey", {
      survey: this.state.survey.status,
      client: this.state.currentUser,
      leader: this.state.clientDetails.LeaderUID,
      name: this.state.name,
    });
  }

  editProfile = () => {
    this.props.navigation.navigate("EditClient");
  }

  render() {
    if(this.state.loading){
      return <LoadingScreen/>;
    }
    else {
      if(this.state.newSurveys){
        return (
          <View style={styles.container}>
            <NavigationEvents onDidFocus={() => {
              this.surveyDone();
            }
            } />
            <Text>Hi {this.state.email}! You're logged in :) </Text>
            <TouchableOpacity style = {styles.surveysOptions} onPress = {this.answerSurvey}>
              <View>
                <Text style = {{fontWeight: 'bold', fontSize: 15}}>You have a new survey!</Text>
                <Text>Tap here to answer.</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.surveysOptions} onPress={this.editProfile}>
              <View>
                <Text>Edit Profile</Text>
              </View>
            </TouchableOpacity>
    
            <TouchableOpacity style = {styles.surveysOptions} onPress={this.signOutUser}>
              <Text>LogOut</Text>
            </TouchableOpacity>
          </View>
        )
      }else{
          return (
            <View style={styles.container}>
              <Text>Hi {this.state.email}! You're logged in :) </Text>
              <TouchableOpacity style = {styles.surveysOptions}>
                <View>
                  <Text>No pending surveys</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.surveysOptions} onPress={this.editProfile}>
                <View>
                  <Text>Edit Profile</Text>
                </View>
              </TouchableOpacity>
      
              <TouchableOpacity style = {styles.surveysOptions} onPress={this.signOutUser}>
              <Text>LogOut</Text>
            </TouchableOpacity>
            </View>
          );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "center",
    margin: '5%',
  },
  surveysOptions: {
    borderWidth: 1, 
    borderRadius: 20, 
    justifyContent: 'center', 
    height: '10%', 
    width: '70%', 
    alignItems: 'center',
    marginVertical: '3%',
  }
});

export default withNavigation(HomeClientScreen);