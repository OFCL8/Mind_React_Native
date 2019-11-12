import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import * as firebase from 'firebase';

export default class HomeClientScreen extends React.Component {

  state = {
    email: "",
    company: '',
    name: '',
    currentUser: "", 
    role: "",
    newSurveys: true,
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };

  async componentWillMount() {
    var clientDetails = [];
    var currentUser = await firebase.auth().currentUser.uid;
    const { email } = await firebase.auth().currentUser;
    db = firebase.firestore();
    
    const response = await db.collection('Users').doc(String(currentUser)).get()
    .then((doc) => {
      if(doc.exists)
        console.log('User found');
      else
        console.log('User not found')
    }).catch((error) => {
      console.log('Error getting document: ' , error)
    })

    this.setState({ email });
  }

  render() {

    if(this.state.newSurveys){
      return (
        <View style={styles.container}>
          <Text>Hi {this.state.email}! You're logged in :) </Text>
          <TouchableOpacity style = {styles.surveysOptions}>
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