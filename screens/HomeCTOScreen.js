import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Button} from "react-native";
import Constants from 'expo-constants';
import { withNavigation } from 'react-navigation';

import * as firebase from 'firebase';

const { width, height } = Dimensions.get('window');

class HomeCTOScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  users = [];
  currentUserLog = '';

  state = {
    email: "",
    role: "",
    users: [],
    loading: true,
  };

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
            data = {this.users}
            extraData = {this.state.loading}
            keyExtractor = {item => String(item.Email)}
            renderItem = {this.renderUsers}
          />
          <TouchableOpacity style={styles.addbutton} onPress={this.addUser}>
            <Text style={{fontSize: 20}}>+</Text>
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
  }
});
export default withNavigation(HomeCTOScreen);