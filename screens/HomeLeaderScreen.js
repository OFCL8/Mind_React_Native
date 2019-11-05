import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from "react-native";
import Constants from 'expo-constants';
//import Survey from "../components/Survey";
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
//import { FlatList } from "react-native-gesture-handler";


const { width, height } = Dimensions.get('window');

export default class HomeLeaderScreen extends React.Component {

  state = {
    email: "",
    role: "",
    clients: [],
    loading: true,
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };

  addClient = () => {
    this.props.navigation.navigate("AddClient");
  }

  componentDidMount = async () => {
    
    try{
      db = await firebase.firestore();
      console.log('Connection succesfull');
    }catch(e){
      console.error(e);
      alert('Error connecting to firebase');
    }

    const { email } = firebase.auth().currentUser;
    console.log('Hello')

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

    this.getClients();

    this.setState({ email });
  }

  getClients = async () => {
    console.log('Trying to get clients');
    try{
      const response = await db.collection('Users').where('Role', '==', 'Client').get().then(snapshot => {
        snapshot.forEach((doc) => {
          console.log('document: ' + doc.id)
          console.log(doc.data());
          this.setState({
            clients: [...this.state.clients, doc.data()],
          });
        });
      }).then(() => {
        console.log('got all the clients');
        this.setState({
          loading: false,
        });
      });
    }catch(e){
      console.error(e);
    }
  }

  async asas(){
    console.log('clientessss: ' + this.state.clients[0]);
  }

  renderClients = (index, _item) => {
    console.log('rendering the next clients');
    console.log(this.state.clients[index]);
    return(
      <View>
        <Text>item</Text>
      </View>
    );
  }

  render() {
    this.asas();
    if(this.state.loading){
      console.log('rendering inside loading');
      return (
      <View style = {styles.container}>
        <Text>Loading</Text>
      </View>)
    }else{
      console.log('rendering flatlist');
      return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Hi {this.state.email}, you're a {this.state.role}!</Text>
            {/* <FlatList
              data = {this.state.clients}
              extraData = {this.state}
              //keyExtractor = {item => String(item.id)}
              renderItem = {this.renderClients}
            /> */}
            <Text>{this.state.clients[0].Email}</Text>

            {/* <Survey/>
            <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
              <Text style={{fontSize:0}}>+</Text>
            </TouchableOpacity> */}
          </ScrollView>
      )
    }
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