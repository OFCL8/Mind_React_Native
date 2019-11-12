import React from 'react';
import {View, Button, Flatlist, Text} from 'react-native';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';


export default class LeaderDetailsScreen extends React.Component{

  state = {
    leaderDetails: {},
    loading: true,
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Leader Details'
    };
  };

  componentDidMount(){
    this.setState({
      leaderDetails: this.props.navigation.getParam('leaderDetails', 'NO-ID')
    }, () => {
      this.setState({
        loading: false,
      })
    });
  }
  
  render(){
    if(this.state.loading){
      return(
        <View>
          <Text>Loading leader info</Text>
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
            <Text>{this.state.leaderDetails.Company} - </Text>
            <Text>{this.state.leaderDetails.Name}</Text>
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

        </ScrollView>
      );
    }
  }
}