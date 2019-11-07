import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';
import { withNavigation } from 'react-navigation';

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

  componentDidMount() {
    const { email } = firebase.auth().currentUser;

    this.setState({ email });
  }

  render() {
    return (

      <View style={styles.container}>
          <Text style={styles.title}>Hi {this.state.email}</Text>
          <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
            <Text style={{fontSize:0}}>+</Text>
          </TouchableOpacity>
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