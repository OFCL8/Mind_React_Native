import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import * as firebase from 'firebase';
import { withNavigation } from "react-navigation";

class HomeClientScreen extends React.Component {

  constructor(props){
    super(props)
  }

  state = {
    email: "",
    company: '',
    name: '',
    currentUser: "", 
    role: "",
    newSurveys: false,
    clientDetails: {},
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };

  async componentDidMount() {
    //var clientDetails = {};
    var currentUser = await firebase.auth().currentUser.uid;
    const { email } = await firebase.auth().currentUser;
    db = firebase.firestore();
    
    const userData = await db.collection('Users')
    .doc(String(currentUser))
    .get()
    .then((doc) => {
      if(doc.exists){
        console.log('User found');
        this.setState({
          clientDetails: doc.data(),
        });
        //clientDetails = doc.data();
        //console.log('Los details del cliente son: ', clientDetails);
      }
      else
        console.log('User not found');
    })
    .catch((error) => {
      console.log('Error getting document: ' , error)
    });

    const surveyData = await db.collection('leaderSurvey')
    .doc(String(this.state.clientDetails.Company+this.state.clientDetails.Name))
    .get()
    .then((doc) => {
      if(doc.exists){
        console.log('Survey found!!!')
        this.setState({
          newSurveys: true,
        });
      } else {
        console.log('No new surveys :{');
      }
    })
    .catch((error) => {
      console.log('Could not connect to firebase: ', error)
    });

    this.setState({ email });
  }

  answerSurvey = () => {
    this.props.navigation.navigate("DetailsClient", {
      clientDetails: this.state.clientDetails,
    });
  }

  render() {

    if(this.state.newSurveys){
      return (
        <View style={styles.container}>
          <Text>Hi {this.state.email}! You're logged in :) </Text>
          <TouchableOpacity style = {styles.surveysOptions} onPress = {this.answerSurvey}>
            <View>
              <Text style = {{fontWeight: 'bold', fontSize: 15}}>You have new surveys!!!</Text>
              <Text>Tap here to answer them</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.surveysOptions}>
            <View>
              <Text>Survey history</Text>
            </View>
          </TouchableOpacity>
  
          <TouchableOpacity style={{marginTop: 32}} onPress={this.signOutUser}>
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
          <TouchableOpacity style = {styles.surveysOptions}>
            <View>
              <Text>Survey history</Text>
            </View>
          </TouchableOpacity>
  
          <TouchableOpacity style={{marginTop: 32}} onPress={this.signOutUser}>
            <Text>LogOut</Text>
          </TouchableOpacity>
        </View>
      )
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

export default withNavigation (HomeClientScreen)