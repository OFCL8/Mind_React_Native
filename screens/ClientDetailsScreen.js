import React from 'react';
import {View, Dimensions, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import LoadingScreen from "./LoadingScreen";

const { width, height } = Dimensions.get('window');

export default class ClientDetailsScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      clientDetails: {},
      loading: true
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Client Details';
    let headerRight = (<Button
    title="Options" 
    type="clear"
    color="blue"
    style={{fontSize: 15, color: 'white'}}
    onPress={()=>{ params.toggle(); }}>Options</Button>);
    return { headerTitle, headerRight };
  };

  setPickerValue (newValue) {
    this.props.navigation.setParams({pickerDisplayed: false});
    //Handles the selected value to navigate
    switch(newValue)
    {
      case 'editsurvey':
        { 
            this.props.navigation.navigate("EditSurvey", {
            company: this.state.clientDetails.Company,
            name: this.state.clientDetails.Name,
            leaderID: this.state.clientDetails.LeaderUID,
          });
          
        }
        break;
        case 'signout':
        { 
          firebase.auth().signOut();
        }
        break;
    }
  }

  togglePicker() {
    this.props.navigation.setParams({pickerDisplayed: !this.pickerDisplayed});
  }

  componentDidMount(){
    this.props.navigation.setParams({ toggle: this.togglePicker.bind(this), pickerDisplayed:false });
    this.setState({
      clientDetails: this.props.navigation.getParam('clientDetails', 'NO-ID')
    }, () => {
      this.setState({
        loading: false,
      })
    });
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
    const { params } = this.props.navigation.state;
    const pickerValues = [
      {
        title: 'Edit Survey',
        value: 'editsurvey'
      },
      {
        title: 'Log Out',
        value: 'signout'
      }
    ]
    if(this.state.loading || params.pickerDisplayed==undefined){
      return <LoadingScreen/>;
    }else{
      return(
        <View contentContainerStyle = {{flex: 1, justifyContent: 'center' , padding: 5}}>
          <ScrollView >
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
          <View style={{padding: 2}}>
            <LineChart
            data={{
              labels: ["PartnerShip", "Goal Oriented", "Quality", "Velocity", "Communication", "Success"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }
              ]
            }}
            width={ width - 7}// from react-native
            height={500}
            verticalLabelRotation = {60}
            chartConfig={{
              backgroundColor: "blue",
              backgroundGradientFrom: "#6593F5",
              backgroundGradientTo: "#003152",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              barPercentage: 0.1,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "black"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            />
            </View>
            <View>
            <Modal visible= {params.pickerDisplayed} animationType={"slide"} transparent={false}>
              <View style={styles.container}>
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
        </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});