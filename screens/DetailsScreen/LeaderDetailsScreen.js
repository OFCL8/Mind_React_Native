import React from 'react';
import Constants from 'expo-constants';
import { Button, Dimensions, FlatList, View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import LoadingScreen from "../LoadingScreen";

var meanScore = 0;
const { width, height } = Dimensions.get('window');

export default class LeaderDetailsScreen extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      leaderDetails: {},
      loading: true,
      meanScore: 0
    }
  }
  
  leaderUID = '';
  scores = [];
  clientsFromLeader = [];
  clientScore = [];

  static navigationOptions = () => {
    let headerTitle = 'Leader Details';
    return { headerTitle };
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

  componentDidMount() {
    meanScore = 0;
    this.props.navigation.setParams({ toggle: this.togglePicker.bind(this), pickerDisplayed:false });
    this.setState({ leaderDetails: this.props.navigation.getParam('leaderDetails', 'NO-ID') });
    this.leaderUID = this.props.navigation.getParam('userUID');
    this.getUsers();
    this.setState({
      loading: false,
    });
  };
  
  leaderMeanScore = () => {
    for (let i = 0; i < this.scores.length; i++) {
      meanScore += this.scores[i].globalScore;
    }
    meanScore /= this.scores.length;
  }
  
  getUsers() {
    let gscore = db.collection('globalScores').where('liderUID','==',this.leaderUID);
    let getDoc = gscore.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
        snapshot.forEach(doc => {
          this.scores.push(doc.data());
          this.clientScore.push(doc.data().globalScore);
          this.clientsFromLeader.push(doc.data().company);
        });
        this.leaderMeanScore()
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
  
  renderScores = ({index, item}) => {
    return(
      <View style = {styles.flatListStyle}>
          <Text style = {styles.textStyle}>{item.company}</Text>
          <Text style = {styles.textStyle}>{item.globalScore}</Text>
      </View>
    );
  }
  render(){
    if(this.state.loading || this.clientScore.length === 0){
      return <LoadingScreen/>;
    }else{
      return(
        <ScrollView contentContainerStyle = {{ justifyContent: 'center' , padding: 5}}> 
          <View>
            <Text style = {{ alignSelf: 'center', fontSize: 30, fontWeight: 'bold', marginBottom: 10}}>{parseFloat(meanScore.toFixed(2))}</Text>
          </View>
          <FlatList
            style = {{marginBottom:10}}
            data = {this.scores}
            extraData = {this.state.loading}
            keyExtractor = {item => String(item.company)}
            renderItem = {this.renderScores}
          />
            <View style={{padding: 2}}>
              <LineChart
              data={{
                labels: this.clientsFromLeader,
                datasets: [
                  {
                    data: this.clientScore
                  }
                ]
              }}
              width={ width + 220}// from react-native
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
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
    marginBottom: 10
  },
  flatListStyle: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: '#FFF',
    color: '#000',
    margin: 10,
    borderRadius: 20,
    height: 50,
    borderWidth: 1,
  },
  textStyle: {
    fontSize: 18, fontWeight: 'bold', 
    marginHorizontal: 15,
  },
});