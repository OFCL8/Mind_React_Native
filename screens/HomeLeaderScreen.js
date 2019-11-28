import React from 'react';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, FlatList } from "react-native";
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import { withNavigation } from 'react-navigation';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import LoadingScreen from "./LoadingScreen";

const { width, height } = Dimensions.get('window');

class HomeLeaderScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  
  setPickerValue (newValue) {
    this.props.navigation.setParams({pickerDisplayed: false});
    //Handles the selected value to navigate
    switch(newValue)
    {
      case 'editprofile':
        { 
          console.log("Holo"); this.props.navigation.navigate("EditLeader");
        }
        break;
      case 'logout':
        { firebase.auth().signOut(); }
        break;
    }
  }

 clientes = [];
 currentUserLog = '';

  state = {
    email: "",
    role: "",
    clients: [],
    loading: true,
  };
  
  addClient = () => {
    this.props.navigation.navigate("AddClient");
  }
  
  registerForPushNotificationsAsync = async() => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') { return; }
    try {
      // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    firebase.firestore().doc(`Users/${ this.currentUserLog }`).update({push_token:token});
    firebase.database().ref('users/'+ this.currentUserLog +'/push_token').set(token);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    db = await firebase.firestore();

    const { email } =  firebase.auth().currentUser;
    
    const currentUser = firebase.auth().currentUser.uid;
    this.currentUserLog = currentUser;
    const clients = await this.getClients();
    this.setState({ email });
    await this.registerForPushNotificationsAsync();
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
  const { params } = this.props.navigation.state;
  const pickerValues = [
    {
      title: 'Edit My Profile',
      value: 'editprofile'
    },
    {
      title: 'Log Out',
      value: 'logout'
    }
  ]
    if(this.state.loading){
      return <LoadingScreen/>;
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
          <View>
            <Modal visible= {params.pickerDisplayed} animationType={"slide"} transparent={false}>
              <View style={styles.modalscreen}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 25 }}>Select Option</Text>
                { pickerValues.map((value, index) => {
                  return <TouchableOpacity key={ index } onPress={() => this.setPickerValue(value.value)} style={{ paddingTop: 4, paddingBottom: 4, alignItems: 'center' }}>
                        <Text style={{ fontSize: 25 }}>{value.title}</Text>
                    </TouchableOpacity>
                })}
                <TouchableOpacity onPress={()=>this.props.navigation.setParams({pickerDisplayed: false})} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <Text style={{ color: '#999', fontSize: 25 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
           </Modal>
          </View>
          <TouchableOpacity style={styles.addbutton} onPress={this.addClient}>
            <Text style={{fontSize: 20}}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      );
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
    bottom: height - 660,
    elevation: 2,
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
  },
  modalscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default withNavigation(HomeLeaderScreen);