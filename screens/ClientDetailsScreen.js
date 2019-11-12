import React from 'react';
import {View, Flatlist, Text} from 'react-native';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import PopupMenu from '../components/PopupMenu';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class ClientDetailsScreen extends React.Component{

  state = {
    clientDetails: {},
    loading: true,
    modalVisible: false,
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Client Details',
      headerRight: () => (
        <Button
          onPress={navigation.getParam("popupMenu")}
          title="Edit Survey"
          type="clear"
          color="#4fa"
        />
      ),
    };
  };

  componentDidMount(){
    this.setState({
      clientDetails: this.props.navigation.getParam('clientDetails', 'NO-ID')
    }, () => {
      this.setState({
        loading: false,
      })
    });
    this.props.navigation.setParams({editSurvey: this.editSurvey});
    this.props.navigation.setParams({popupMenu: this.changeValue});
  }

  changeValue = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  editSurvey = () => {
    this.props.navigation.navigate("EditSurvey", {
      company: this.state.clientDetails.Company,
      name: this.state.clientDetails.Name,
      leaderID: this.state.clientDetails.LeaderUID,
    });
    this.setState({modalVisible: !this.state.modalVisible});
  }

  sendPushNotification = () => {
    let response = fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        to: this.state.clientDetails.push_token,
        sound: 'default',
        title: 'Notification',
        body: 'You have a new survey, go check it out!'
      })
    });
  };

  render(){
    if(this.state.loading){
      return(
        <View>
          <Text>Loading client info</Text>
        </View>
      );
    }else{
      return(
        <ScrollView contentContainerStyle = {{flex: 1, justifyContent: 'center'}}>
          
          {/* Score View */}
          <View style = {{flexDirection: 'row', justifyContent:'center'}}>
            <Text style = {{fontWeight: 'bold', fontSize: 25}}>0.0</Text>
          </View>

          {/* Client data View */}
          <View style = {{flexDirection: 'row', justifyContent:'center'}}>
            <Text>{this.state.clientDetails.Company} - </Text>
            <Text>{this.state.clientDetails.Name}</Text>
          </View>

          {/* Client Overall Satisfaction table View list */}
          <View>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, marginHorizontal: 50}}>
              <Text>Succes: </Text>
              <Text>0.0</Text>
            </View>

            <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, marginHorizontal: 50}}>
              <Text>Partnership: </Text>
              <Text>0.0</Text>
            </View>

            <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, marginHorizontal: 50}}>
              <Text>Goal oriented: </Text>
              <Text>0.0</Text>
            </View>

            <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, marginHorizontal: 50}}>
              <Text>Quality: </Text>
              <Text>0.0</Text>
            </View>

            <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, marginHorizontal: 50}}>
              <Text>Velocity: </Text>
              <Text>0.0</Text>
            </View>

            <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, marginHorizontal: 50}}>
              <Text>Communication: </Text>
              <Text>0.0</Text>
            </View>
          </View>
          <View>
            <PopupMenu 
              visible = {this.state.modalVisible} 
              onPress = {this.changeValue} 
              onNav = {this.editSurvey}
            />
          </View>

          <Button 
            icon={
              <Icon
                name="bell"
                size={15}
                color="#4682B4"
              />
            }
            type="clear"
            iconRight
            title="Send Request Survey" 
            onPress={()=>this.sendPushNotification()}
          />
        </ScrollView>
      );
    }
  }
}