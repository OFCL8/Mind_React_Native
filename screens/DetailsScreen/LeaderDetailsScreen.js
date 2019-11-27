import React from 'react';
import { Button, Flatlist, View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingScreen from "../LoadingScreen";

export default class LeaderDetailsScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      leaderDetails: {},
      loading: true
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Leader Details';
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
      case 'editprofile':
        { 
            this.props.navigation.navigate("EditCTO");
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
      leaderDetails: this.props.navigation.getParam('leaderDetails', 'NO-ID')
    }, () => {
      this.setState({
        loading: false,
      })
    });
  }
  
  render(){
    const { params } = this.props.navigation.state;
    const pickerValues = [
      {
        title: 'Edit My Profile',
        value: 'editprofile'
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