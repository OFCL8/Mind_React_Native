import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Constants from 'expo-constants';
import Survey from "../components/Survey";

const { width, height } = Dimensions.get('window');

import * as firebase from 'firebase';

export default class HomeLeaderScreen extends React.Component {

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

  componentDidMount() {
    const { email } = firebase.auth().currentUser;

    //Checks for role of current user
    const currentUser = firebase.auth().currentUser.uid;
    firebase.firestore().doc(`Users/${ currentUser }`).onSnapshot(doc=>{ 
      this.setState({role:  doc.get("Role")}) //Setting role state value of current user role
      switch(this.state.role)
      {
        case "CTO":
          { this.props.navigation.navigate("Home"); }
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
      <ScrollView style={styles.container}>
          <Text style={styles.title}>Hi {this.state.email}, you're a {this.state.role}!</Text>
            <Survey/>
          <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
            <Text style={{fontSize:0}}>+</Text>
          </TouchableOpacity>
        </ScrollView>
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
    bottom: 5,
    height: 60,
    justifyContent: 'center',
    left: 280,
    shadowOpacity: 0.2,
    position: 'relative',
    width: 60
  }
});