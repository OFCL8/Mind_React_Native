import React from "react";
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import Constants from 'expo-constants';
import { Input } from 'react-native-elements';
import LoadingScreen from "../LoadingScreen";
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default class EditClientScreen extends React.Component {
  state = {
    UID: firebase.auth().currentUser.uid,
    Name: "",
    Company: "",
    Email: "",
    Password: "",
    NewPassword: "",
    errorMessage: null,
    loading: true
  }

  handleChangeText(newText) {
    this.setState({
      value: newText
    })
  }

  static navigationOptions = () => {
    let headerTitle = 'My Profile';
    return { headerTitle };
  };

  updateClientInfo() {
    const { UID, Name, Company, Email, Password, NewPassword } = this.state;

    //Checks if data is empty
    if(Name =="" || Company =="" || Email =="")
    { Alert.alert("Please don't leave blank data"); }
    else
    {
      //Checks if email was changed
      var user = firebase.auth().currentUser;
      if(Email != user.email)
      {
        user.updateEmail(Email).then(() => { Alert.alert("Email was successfully changed");})
      .catch(error => this.setState({errorMessage: error.message}));
      }
      //Updates firestore user data
      firebase.firestore().doc(`Users/${ UID }`).update({
        Name: Name,
        Company: Company,
        Email: Email
      }).catch(error => this.setState({errorMessage: error.message}));
      //Checks if passwords are empty
      if(Password !="" && NewPassword != "") {
        this.reauthenticate(Password).then(() => {
          user.updatePassword(NewPassword).then(() => { Alert.alert("Password was successfully changed"); })
          .catch(error => this.setState({errorMessage: error.message}));
        }).catch(error => this.setState({errorMessage: error.message}));
      }
      }
  }
  //Method for changing password without re-sign in
  reauthenticate(Password) {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, Password);
    return user.reauthenticateWithCredential(cred);
  }

  componentDidMount() {
    this.setState({ loading: false });
    firebase.firestore().doc(`Users/${ this.state.UID }`).get().then(user => {
      clientInfo = user.data();
      this.setState({
        Name: clientInfo.Name,
        Company: clientInfo.Company,
        Email: clientInfo.Email
      });
    });
  }

  render() {
    if(this.state.loading) {
      console.log(this.state.loading);
      return <LoadingScreen/>;
    }
    else {
      return (
        <SafeAreaView style={styles.container}>
           <KeyboardAvoidingView style={{flex:1}} behavior={Platform.Os == "ios" ? "padding" : "height" } enabled>
           <StatusBar backgroundColor="blue" barStyle="light-content" />
  
            <Input
            placeholder='Name'
            defaultValue={this.state.Name}
            onChangeText={Name => this.setState({ Name })}
            value={this.state.Name}
            />

            
            <Input 
            placeholder='Company'
            defaultValue={this.state.Company}
            onChangeText={Company => this.setState({ Company })}
            value={this.state.Company}
            />

            
            <Input 
            autoCapitalize="none"
            placeholder='Email'
            keyboardType="email-address"
            defaultValue={this.state.Email}
            onChangeText={Email => this.setState({ Email })}
            value={this.state.Email}
            />

          <Input 
            autoCapitalize="none"
            placeholder='Current Password'
            defaultValue={this.state.Password}
            secureTextEntry
            onChangeText={Password => this.setState({ Password })}
            value={this.state.Password}
            />

          <Input 
            autoCapitalize="none"
            placeholder='New Password'
            defaultValue={this.state.NewPassword}
            secureTextEntry
            onChangeText={NewPassword => this.setState({ NewPassword })}
            value={this.state.NewPassword}
            />
          
          <View style={styles.errorMessage}>
              { this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
          </View>

            <TouchableOpacity style={styles.addbutton} onPress={() => this.updateClientInfo()}>
            <Icon
                    name="refresh"
                    size={20}
                    color="#4682B4"
                  />
            </TouchableOpacity>
           </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
    marginBottom: 10,
    justifyContent: 'center',
    padding: 20
  },
  addbutton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 60,
    bottom: height - 730,
    elevation: 2,
    height: 60,
    justifyContent: 'center',
    left: width - 100,
    shadowOpacity: 0.2,
    position: 'relative',
    width: 60
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  }
});