import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
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
    userName: "",
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

  setPickerValue (newValue) {
    this.props.navigation.setParams({pickerDisplayed: false});
    //Handles the selected value to navigate
    switch(newValue)
    {
      case 'editprofile':
        { 
          this.props.navigation.navigate("EditCTO");
        }
        break;
      case 'logout':
        { firebase.auth().signOut(); }
        break;
    }
  }

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
          userName: doc.data().Name
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
    firebase.firestore().doc(`Users/${ firebase.auth().currentUser.uid }`).update({push_token:token});
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
    const { params } = this.props.navigation.state;
    const pickerValues = [
      {
        title: 'Edit My Profile',
        value: 'editprofile'
      },
      {
        title: 'Log Out',
        value: 'logout'
      }
    ]
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
            <View style={styles.infoContainer}>
                <Text style={[styles.displayName, {fontWeight: "200", fontSize: 28}]}>Hi {this.state.userName}!</Text>
            </View>

            <TouchableOpacity style = {styles.surveysOptions} onPress = {this.answerSurvey}>
              <View>
                <Text style = {{fontWeight: 'bold', fontSize: 15}}>You have a new survey!</Text>
                <Text>Tap here to answer.</Text>
              </View>
            </TouchableOpacity>
            <View>
            <Modal visible= {params.pickerDisplayed} animationType={"slide"} transparent={false}>
              <View style={styles.modalscreen}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 25 }}>Select Option</Text>
                { pickerValues.map((value, index) => {
                  return <TouchableOpacity key={ index } onPress={() => this.setPickerValue(value.value)} style={{ paddingTop: 4, paddingBottom: 4, alignItems: 'center' }}>
                        <Text style={{ fontSize: 25 }}>{value.title}</Text>
                    </TouchableOpacity>
                })}
                <TouchableOpacity onPress={()=>this.props.navigation.setParams({pickerDisplayed: false})} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <Text style={{ color: '#999', fontSize: 25 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
           </Modal>
          </View>
          </View>
        )
      }else{
          return (
            <View style={styles.container}>
              <View style={styles.infoContainer}>
                <Text style={[styles.displayName, {fontWeight: "200", fontSize: 28}]}>Hi {this.state.userName}!</Text>
              </View>
              <TouchableOpacity style = {styles.surveysOptions}>
                <View>
                  <Text>No pending surveys</Text>
                </View>
              </TouchableOpacity>
              <View>
              <Modal visible= {params.pickerDisplayed} animationType={"slide"} transparent={false}>
                <View style={styles.modalscreen}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 25 }}>Select Option</Text>
                  { pickerValues.map((value, index) => {
                    return <TouchableOpacity key={ index } onPress={() => this.setPickerValue(value.value)} style={{ paddingTop: 4, paddingBottom: 4, alignItems: 'center' }}>
                          <Text style={{ fontSize: 25 }}>{value.title}</Text>
                      </TouchableOpacity>
                  })}
                  <TouchableOpacity onPress={()=>this.props.navigation.setParams({pickerDisplayed: false})} style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <Text style={{ color: '#999', fontSize: 25 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
            </Modal>
          </View>
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
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  surveysOptions: {
    borderWidth: 1, 
    borderRadius: 20, 
    justifyContent: 'center', 
    height: '10%', 
    width: '70%', 
    alignItems: 'center',
    marginVertical: '3%',
  },
  modalscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontFamily: "Helvetica",
    color: "#52575D"
  }
});

export default withNavigation(HomeClientScreen);