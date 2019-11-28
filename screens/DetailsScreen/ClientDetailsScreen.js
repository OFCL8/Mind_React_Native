import React from 'react';
import {View, Dimensions, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import LoadingScreen from "../LoadingScreen";

var surveys = [];
var question = [];

var globalScore = 0;
var partnership = [];
var goalOriented = [];
var qualityControl = [];
var developmentVelocity = [];
var communication = [];
var success = [];

var score = {
  partnership: {
    id: 1,
    name: 'partnership',
    weight: 15,
    score: 0,
    percentage: 0,
  },
  goalOriented: {
    id: 2,
    name: 'goalOriented',
    weight: 15,
    score: 0,
    percentage: 0,
  },
  qualityControl: {
    id: 3,
    name: 'qualityControl',
    weight: 15,
    score: 0,
    percentage: 0,
  },
  developmentVelocity: {
    id: 4,
    name: 'developmentVelocity',
    weight: 15,
    score: 0,
    percentage: 0,
  },
  communication: {
    id: 5,
    name: 'communication',
    weight: 15,
    score: 0,
    percentage: 0,
  },
  success: {
    id: 6,
    name: 'succes',
    weight: 25,
    score: 0,
    percentage: 0,
  },
}
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
    title="Edit Survey" 
    type="clear"
    color="blue"
    style={{fontSize: 15, color: 'white'}}
    onPress={()=>{ params.edit(); }}>Edit Survey</Button>);
    return { headerTitle, headerRight };
  };

  editSurvey() {
    this.props.navigation.navigate("EditSurvey", {
      company: this.state.clientDetails.Company,
      name: this.state.clientDetails.Name,
      leaderID: this.state.clientDetails.LeaderUID,
    });
  }

  componentDidMount(){
    score.partnership.score = 0;
    score.qualityControl.score = 0;
    score.communication.score = 0;
    score.developmentVelocity.score = 0;
    score.goalOriented.score = 0;
    score.success.score = 0;
    question = [];
    globalScore = 0;
    db = firebase.firestore();
    const clientData = this.props.navigation.getParam('clientDetails', 'NO-ID');
    //Bind the function to access from header button
    this.props.navigation.setParams({ edit: this.editSurvey.bind(this) });

    this.setState({
      clientDetails: clientData
    }, () => {
      this.getData().then(() => {
        this.setState({ loading: false });
      });
    });
  }

  sendPushNotification = () => {
    db.collection('leaderSurvey').doc(this.state.clientDetails.Company + this.state.clientDetails.Name).update({answered: false});
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
  }
  
  getData = async () => {
    let temp = this.state.clientDetails.Company + this.state.clientDetails.Name;
    const response = await db
    .collection('answeredSurveys').where('name', '==', temp)
    .get()
    .then((query) => {
      query.forEach(doc => {
        question.push(doc.data());
      });

      console.log('Finished pushing data, analyzing.')

      if(question.length != 0){
        this.analyzeData();
        this.setScores();
      }
    }).catch(error => {
      console.log('Error connecting to FB', error);
    });
  }
  
  printNames = () => {
    score.forEach(element => {
      console.log(element.name);
    });
  }
  
  analyzeData = () => {
    for(let i = 0 ; i < question[0].status.length ; i++){
      for(let j = 0 ; j < question[0].status[i].teamskill.length ; j++){
        if(question[0].status[i].teamskill[j] == 1 && (question[0].status[i].status))
          partnership.push(question[0].surveyAnswers[i]);
        
        if(question[0].status[i].teamskill[j] == 2  && (question[0].status[i].status))
          goalOriented.push(question[0].surveyAnswers[i]);
        
        if(question[0].status[i].teamskill[j] == 3  && (question[0].status[i].status))
          qualityControl.push(question[0].surveyAnswers[i]);
        
        if(question[0].status[i].teamskill[j] == 4  && (question[0].status[i].status))
          developmentVelocity.push(question[0].surveyAnswers[i]);
        
        if(question[0].status[i].teamskill[j] == 5  && (question[0].status[i].status))
          communication.push(question[0].surveyAnswers[i]);
        
        if(question[0].status[i].teamskill[j] == 6  && (question[0].status[i].status))
          success.push(question[0].surveyAnswers[i]);
      }
    }
  }
  
  setScores = () => {
    globalScore = 0;
    for(let i = 0 ; i < partnership.length ; i++)
    {
      score.partnership.score += (partnership[i].answer * (score.partnership.weight / partnership.length)) / 5;
    }
    globalScore += score.partnership.score;
  
    for(let i = 0 ; i < goalOriented.length ; i++)
    {
      score.goalOriented.score += (goalOriented[i].answer * (score.goalOriented.weight / goalOriented.length)) / 5;
    }
    globalScore += score.goalOriented.score;
  
    for(let i = 0 ; i < qualityControl.length ; i++)
    {
      score.qualityControl.score += (qualityControl[i].answer * (score.qualityControl.weight / qualityControl.length)) / 5;
    }
    globalScore += score.qualityControl.score;
  
    for(let i = 0 ; i < developmentVelocity.length ; i++)
    {
      score.developmentVelocity.score += (developmentVelocity[i].answer * (score.developmentVelocity.weight / developmentVelocity.length)) / 5;
    }
    globalScore += score.developmentVelocity.score;
  
    for(let i = 0 ; i < communication.length ; i++)
    {
      score.communication.score += (communication[i].answer * (score.communication.weight / communication.length)) / 5;
    }
    globalScore += score.communication.score;
  
    for(let i = 0 ; i < success.length ; i++)
    {
      score.success.score += (success[i].answer * (score.success.weight / success.length)) / 5;
    }
    globalScore += score.success.score;
  }

  render(){
    if(this.state.loading){
      return <LoadingScreen/>;
    }else{
      return(
        <View contentContainerStyle = {{flex: 1, justifyContent: 'center' , padding: 5}}>
          <ScrollView >
          {/* Score View */}
          <View style = {{flexDirection: 'row', justifyContent:'center'}}>
            <Text style = {{fontWeight: 'bold', fontSize: 25}}>{globalScore}</Text>
          </View>

          {/* Client data View */}
          <View style = {{flexDirection: 'row', justifyContent:'center'}}>
            <Text>{this.state.clientDetails.Company} - </Text>
            <Text>{this.state.clientDetails.Name}</Text>
          </View>

          {/* Client Email*/}
          <View style = {{flexDirection: 'row', justifyContent:'center'}}>
            <Text>{this.state.clientDetails.Email}</Text>
          </View>

          {/* Client Overall Satisfaction table View list */}
          <View>
            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Succes: </Text>
              <Text>{score.success.score}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Partnership: </Text>
              <Text>{score.partnership.score}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Goal oriented: </Text>
              <Text>{score.goalOriented.score}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Quality: </Text>
              <Text>{score.qualityControl.score}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Velocity: </Text>
              <Text>{score.developmentVelocity.score}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Communication: </Text>
              <Text>{score.communication.score}</Text>
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
                    score.partnership.score,
                    score.goalOriented.score,
                    score.qualityControl.score,
                    score.developmentVelocity.score,
                    score.communication.score,
                    score.success.score
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