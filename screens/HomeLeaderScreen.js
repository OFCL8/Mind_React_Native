
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Button} from "react-native";
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
import { withNavigation } from 'react-navigation';

const { width, height } = Dimensions.get('window');

class HomeLeaderScreen extends React.Component {
  constructor(props) {
    super(props);
  }

 clientes = [];
 currentUserLog = '';

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

    const { email } =  firebase.auth().currentUser;
    console.log('Got email of current user')
    
    const currentUser = firebase.auth().currentUser.uid;
    this.currentUserLog = currentUser;
    const clients = await this.getClients();
    this.setState({ email });
  }

  getClients = async () => {
    console.log('Trying to get clients');
    try{
      const response = await db.collection('Users').where('Role', '==', 'Client')
      .where('LeaderUID', '==', String(this.currentUserLog)).get().then(snapshot => {
        snapshot.forEach((doc) => {
          this.clientes.push(doc.data());
        });
      }).then(() => {
        console.log('got all the clients');
        console.log(this.clientes);
        this.setState({
          loading: false,
        });
      });
    }catch(e){
      console.error(e);
    }
  }

  renderClients = ({index, item}) => {

    const openDetailsScreen = () => {
      console.log(item)
      this.props.navigation.navigate("DetailsClient", {
        clientDetails: item,
      })
    }

    return(
      <TouchableOpacity onPress = {openDetailsScreen}>
        <View style = {styles.flatListStyle}>
          <Text style = {{fontSize: 18, fontWeight: 'bold'}}>{item.Company}</Text>
          <Text style = {{fontSize: 15}}>{item.Name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if(this.state.loading){
      console.log('rendering inside loading');
      return (
      <View style = {styles.container}>
        <Text>Loading</Text>
      </View>)
    }else{
      console.log('rendering flatlist');
      console.log('Current user log: ' + this.currentUserLog)
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Hi {this.state.email}, you're a {this.state.role}!</Text>
          <FlatList
            data = {this.clientes}
            extraData = {this.state.loading}
            keyExtractor = {item => String(item.Email)}
            renderItem = {this.renderClients}
          />
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
    bottom: height - 850,
    height: 60,
    justifyContent: 'center',
    left: width - 100,
    shadowOpacity: 0.2,
    position: 'relative',
    width: 60
  },
  clientsCard: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    height: '20%',
    width: '80%',
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  flatListStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#FFF',
    color: '#000',
    margin: 10,
    borderRadius: 20,
    height: 50,
    borderWidth: 1,
  }
});

export default withNavigation(HomeLeaderScreen);