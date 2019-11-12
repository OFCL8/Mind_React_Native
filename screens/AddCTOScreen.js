import React from "react";
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import Constants from 'expo-constants';
import { CheckBox, Input } from 'react-native-elements';

const { width, height } = Dimensions.get('window');
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class AddCTOScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Add',
  };

  state = {
    CTOUID: firebase.auth().currentUser.uid,
    Name: "",
    Company: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Role: "CTO",
    checked1: true,
    checked2: false,
    errorMessage: null
  }

  handleChangeText(newText) {
    this.setState({
      value: newText
    })
  }

  addUser = () => {
    const { CTOUID, Name, Company, Email, Password, ConfirmPassword, Role } = this.state;
    
    if (!(Name || Company))
    {
      Alert.alert( 
        'Error',
        'Please enter requested data.',
        [ {text: 'OK', onPress: () => console.log('OK Pressed')}, ],
        {cancelable: false},
      );
    }
    if ((Password === ConfirmPassword) && ((Password && ConfirmPassword) != ""))
    {
      firebase.auth().createUserWithEmailAndPassword(Email,Password).then((user) => {
        firebase.firestore().doc(`Users/${ user.user.uid}`).set({
          CTOUID,
          Name: Name,
          Email: Email,
          Company: Company,
          Password: Password,
          Role: Role
        })
      }).catch(error => this.setState({errorMessage: error.message}));
    }
    else {
      Alert.alert( 
        'Error',
        'Passwords must be equal',
        [ {text: 'OK', onPress: () => console.log('OK Pressed')}, ],
        {cancelable: false},
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
         <StatusBar backgroundColor="blue" barStyle="light-content" />
         <CheckBox
            center
            title='CTO'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked1}
            onPress={() => {
              this.setState({checked1: true}),
              this.setState({checked2: false}),
              this.setState({Role: "CTO"})
            }}
          />
          <CheckBox
            center
            title='Leader'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked2}
            onPress={() => {
              this.setState({checked2: true}),
              this.setState({checked1: false}),
              this.setState({Role: "Leader"})
            }}
          />
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
          defaultValue={this.state.Email}
          onChangeText={Email => this.setState({ Email })}
          value={this.state.Email}
         />

         
         <Input 
          autoCapitalize="none"
          placeholder='Password'
          defaultValue={this.state.Password}
          secureTextEntry
          onChangeText={Password => this.setState({ Password })}
          value={this.state.Password}
         />

        
         <Input 
          autoCapitalize="none"
          placeholder='Confirm Password'
          defaultValue={this.state.ConfirmPassword}
          secureTextEntry
          onChangeText={ConfirmPassword => this.setState({ ConfirmPassword })}
          value={this.state.ConfirmPassword}
         />

         <TouchableOpacity style={styles.addbutton} onPress={this.addUser}>
            <Text style={{fontSize:0}}>+</Text>
          </TouchableOpacity>

          <View style={styles.errorMessage}>
            { this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
          </View>
      </SafeAreaView>
    )
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
    bottom: height - 755,
    height: 60,
    justifyContent: 'center',
    left: width - 100,
    shadowOpacity: 0.2,
    position: 'relative',
    width: 60
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  }
});