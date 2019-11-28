import React from "react";
import { Button, Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import Constants from 'expo-constants';
import { Input } from 'react-native-elements';
import LoadingScreen from "../LoadingScreen";
const { width, height } = Dimensions.get('window');
import * as firebase from 'firebase';

export default class AddClientScreen extends React.Component {
  state = {
    LeaderUID: firebase.auth().currentUser.uid,
    Name: "",
    Company: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    errorMessage: null,
    loading: true
  }

  handleChangeText(newText) {
    this.setState({
      value: newText
    })
  }

  static navigationOptions = () => {
    let headerTitle = 'Add Client';
    return { headerTitle };
  };

  addClient = () => {
    const { LeaderUID, Name, Company, Email, Password, ConfirmPassword } = this.state;
    if (!(Name && Company))
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
          LeaderUID,
          Name: Name,
          Email: Email,
          Company: Company,
          Role: "Client"
        });
        Name && Company && Email && Password && ConfirmPassword == "";
        this.props.navigation.goBack();
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

  componentDidMount() {
    this.setState({loading: false});
  }

  render() {
    if(this.state.loading) {
      return <LoadingScreen/>;
    }
    else {
      return (
        <SafeAreaView style={styles.container}>
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
  
           <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
              <Text style={{fontSize: 20}}>Add New Client</Text>
            </TouchableOpacity>
  
            <View style={styles.errorMessage}>
              { this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
            </View>
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
    borderRadius: 35,
    elevation: 2,
    height: 70,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    shadowOffset: {width:2, height:2},
    shadowColor: 'black',
    shadowOpacity: 0.2
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  }
});