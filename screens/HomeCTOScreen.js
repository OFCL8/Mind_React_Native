import React from 'react';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, FlatList } from "react-native";
import Constants from 'expo-constants';
import { withNavigation } from 'react-navigation';

import * as firebase from 'firebase';
import LoadingScreen from './LoadingScreen';

const { width, height } = Dimensions.get('window');

class HomeCTOScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  users = [];
  currentUserLog = '';

  state = {
    email: "",
    userName: "",
    role: "",
    users: [],
    loading: true,
  };

  setPickerValue (newValue) {
    this.props.navigation.setParams({pickerDisplayed: false});
    //Handles the selected value to navigate
    switch(newValue)
    {
      case 'editprofile':
        { 
          this.props.navigation.navigate("EditCTO");
        }
        break;
      case 'logout':
        { firebase.auth().signOut(); }
        break;
    }
  }

  addUser = () => {
    this.props.navigation.navigate("AddCTO");
  }

  componentDidMount = async () => {
    db = await firebase.firestore();

    const { email } =  firebase.auth().currentUser;
    const currentUser = firebase.auth().currentUser.uid;
    this.currentUserLog = currentUser;
    const users = await this.getUsers();
    this.setState({ email });
    
    //Getting user name
    var { userName } =  db.collection('Users').doc(String(currentUser)).get()
    .then((doc) => {
      if(doc.exists){
        this.setState({ userName: doc.data().Name});
        this.setState({ loading: false });
      }
      else
        console.log('User not found');
    })
    .catch((error) => {
      console.log('Error getting document: ' , error);
    });
  }

  getUsers = async () => {
    try{
      const response = await db.collection('Users').where('Role', '==', 'Leader')
      .where('CTOUID', '==', String(this.currentUserLog)).get().then(snapshot => {
        snapshot.forEach((doc) => {
          this.users.push(doc.data());
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

  renderUsers = ({index, item}) => {
    console.log('item: ' + item.LeaderUID);
    const openDetailsScreen = () => {
      this.props.navigation.navigate("DetailsLeader", {
        leaderDetails: item,
        userUID: item.LeaderUID,
      })
    }

    return(
      <TouchableOpacity onPress = {openDetailsScreen}>
        <View style = {styles.flatListStyle}>
          <Text style = {{fontSize: 18, fontWeight: 'bold'}}>{item.Name}</Text>
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
      return (<LoadingScreen/>);
    }else{
      return (
        <ScrollView style={styles.container}>
          <View style={styles.infoContainer}>
                <Text style={[styles.displayName, {fontWeight: "200", fontSize: 28}]}>Hi {this.state.userName}!</Text>
          </View>

          <FlatList
            data = {this.users}
            extraData = {this.state.loading}
            keyExtractor = {item => String(item.Email)}
            renderItem = {this.renderUsers}
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
          <View>
            <TouchableOpacity style={styles.addbutton} onPress={this.addUser}>
              <Text style={{fontSize: 20}}>+</Text>
            </TouchableOpacity>
          </View>
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
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
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
  },
  displayName: {
    color: "#52575D"
  }
});
export default withNavigation(HomeCTOScreen);