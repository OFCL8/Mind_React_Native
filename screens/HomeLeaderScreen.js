import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Button} from "react-native";
import Constants from 'expo-constants';
import * as firebase from 'firebase';
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
    
    db = await firebase.firestore();

    const { email } =  firebase.auth().currentUser;
    
    const currentUser = firebase.auth().currentUser.uid;
    this.currentUserLog = currentUser;
    const clients = await this.getClients();
    this.setState({ email });
  }

  getClients = async () => {
    try{
      const response = await db.collection('Users').where('Role', '==', 'Client')
      .where('LeaderUID', '==', String(this.currentUserLog)).get().then(snapshot => {
        snapshot.forEach((doc) => {
          this.clientes.push(doc.data());
        });
      }).then(() => {
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
      return (
      <View style = {styles.container}>
        <Text>Loading</Text>
      </View>)
    }else{
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Hi {this.state.email}!</Text>
          <FlatList
            data = {this.clientes}
            extraData = {this.state.loading}
            keyExtractor = {item => String(item.Email)}
            renderItem = {this.renderClients}
          />
          <TouchableOpacity onPress={this.signOutUser}>
            <Text >LogOut</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
            <Text style={{fontSize:30}}>+</Text>
          </TouchableOpacity>
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
    bottom: height - 755,
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