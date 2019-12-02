import React from 'react';
import {View, Dimensions, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import LoadingScreen from "./LoadingScreen";

var surveys = [];
var question = [];

var globalScore = 0;
var latestScore = 0;

var partnership;
var goalOriented ;
var qualityControl;
var developmentVelocity;
var communication;
var success;

var globalPartnership;
var globalGoalOriented;
var globalQualityControl;
var globalDevelopmentVelocity
var globalCommunication;
var globalSuccess;

var globalTeamSkills;

var latestScores = [
  {score: 0, name: 'partnership'}, 
  {score: 0, name: 'goalOriented'}, 
  {score: 0, name: 'qualityControl'}, 
  {score: 0, name: 'developmentVelocity'}, 
  {score: 0, name: 'communication'},
  {score: 0, name: 'success'}
];

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
    this.initVariables();
    db = firebase.firestore();
    const clientData = this.props.navigation.getParam('clientDetails', 'NO-ID');

    this.props.navigation.setParams({ toggle: this.togglePicker.bind(this), pickerDisplayed:false });

    this.setState({
      clientDetails: clientData
    }, () => {
      this.getData();
      console.log('Got the data, rendering screen!!')
      this.setState({
        loading: false,
      });
    });
  }

  initVariables = () => {
    partnership = [];
    goalOriented = [];
    qualityControl = [];
    developmentVelocity = [];
    communication = [];
    success = [];

    score.partnership.score = 0;
    score.qualityControl.score = 0;
    score.communication.score = 0;
    score.developmentVelocity.score = 0;
    score.goalOriented.score = 0;
    score.success.score = 0;

    question = [];
    globalScore = 0;

    globalTeamSkills = [];
    globalPartnership = [];
    globalGoalOriented = [];
    globalQualityControl = [];
    globalDevelopmentVelocity = [];
    globalCommunication = [];
    globalSuccess = [];
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
    console.log('Trying to get: ' + temp);
    const response = await db
    .collection('answeredSurveys').where('name', '==', temp)
    .get()
    .then((query) => {
      query.forEach(doc => {
        question.push(doc.data());
      });

      console.log('Finished pushing data, analyzing.')
    })
    .then(() => {
      if(question.length != 0){
        console.log(question.length);
        console.log('Question is not empty');
        this.analyzeData();
        //this.setScores();
      }
    }).catch(error => {
      console.log('Error connecting to FB', error);
      // this.setState({
      //   loading: false,
      // })
    });
  }
  
  printNames = () => {
    score.forEach(element => {
      console.log(element.name);

    });
  }
  
  analyzeData = () => {
    console.log('This client has ' + question.length + ' encuestas respondidas');
    for(let k = 0 ; k < question.length ; k++){ //Numero de encuestas que se han respondido por el cliente
      console.log('Survey ' + (k+1) );
      for(let i = 0 ; i < question[k].status.length ; i++){ //numero de preguntas de la encuesta (15)
        console.log('Question ' + (i+1));
        for(let j = 0 ; j < question[k].status[i].teamskill.length ; j++){ //numero de team skills a las que pertenece cada pregunta
          console.log('TeamSkill ' + (j+1));
          if(question[k].status[i].teamskill[j] == 1 && (question[k].status[i].status)) //Si la pregunta esta activa y pertenece al TS indicado
            partnership.push(question[k].surveyAnswers[i]); //si la pregunta pertenece al TS 1 se insertan las respuestas de esa pregunta al array indicado
        
          if(question[k].status[i].teamskill[j] == 2  && (question[k].status[i].status))
            goalOriented.push(question[k].surveyAnswers[i]);
        
          if(question[k].status[i].teamskill[j] == 3  && (question[k].status[i].status))
            qualityControl.push(question[k].surveyAnswers[i]);
        
          if(question[k].status[i].teamskill[j] == 4  && (question[k].status[i].status))
            developmentVelocity.push(question[k].surveyAnswers[i]);
        
          if(question[k].status[i].teamskill[j] == 5  && (question[k].status[i].status))
            communication.push(question[k].surveyAnswers[i]);
        
          if(question[k].status[i].teamskill[j] == 6  && (question[k].status[i].status))
            success.push(question[k].surveyAnswers[i]);
        }
      }
      this.setGlobalScores(); //Add the scores of the i survey to global score
    }
    console.log('Global scores for partnership: ' , globalPartnership)
    this.getAverageGlobalScores();
  }

  setGlobalScores = () => {
    for(let i = 0 ; i < partnership.length ; i++){ //numero de respuestas que se anadieron a cada team skill
      score.partnership.score += (partnership[i].answer * (score.partnership.weight / partnership.length)) / 5; //ley de la tortilla
    }
    console.log(score.partnership.score);
    globalPartnership.push(score.partnership.score); //score de cada survey respondida anadido al 
    score.partnership.score = 0; //resetear el score de cada skill para la siguiente vuelta
    partnership = []; //limpiar el array de preguntas para no alterar la ley de la tortilla de arriba

    //Repetir para cada team skill
    for(let i = 0 ; i < goalOriented.length ; i++){
      score.goalOriented.score += (goalOriented[i].answer * (score.goalOriented.weight / goalOriented.length)) / 5;
    }
    globalGoalOriented.push(score.goalOriented.score);
    score.goalOriented.score = 0;
    goalOriented = [];

    for(let i = 0 ; i < qualityControl.length ; i++){
      score.qualityControl.score += (qualityControl[i].answer * (score.qualityControl.weight / qualityControl.length)) / 5;
    }
    globalQualityControl.push(score.qualityControl.score);
    score.qualityControl.score = 0;
    qualityControl = [];

    for(let i = 0 ; i < developmentVelocity.length ; i++){
      score.developmentVelocity.score += (developmentVelocity[i].answer * (score.developmentVelocity.weight / developmentVelocity.length)) / 5;
    }
    globalDevelopmentVelocity.push(score.developmentVelocity.score);
    score.developmentVelocity.score = 0;
    developmentVelocity = [];

    for(let i = 0 ; i < communication.length ; i++){
      score.communication.score += (communication[i].answer * (score.communication.weight / communication.length)) / 5;
    }
    globalCommunication.push(score.communication.score);
    score.communication.score = 0;
    communication = [];

    for(let i = 0 ; i < success.length ; i++){
      score.success.score += (success[i].answer * (score.success.weight / success.length)) / 5;
    }
    globalSuccess.push(score.success.score);
    score.success.score = 0;
    success = []
  }

  getAverageGlobalScores = () => {
    var partn = 0, qc = 0, comm = 0, go = 0, succ = 0, dv = 0;
    globalPartnership.forEach( (element) => {
      partn += element;
    });
    console.log('Partn: ' + partn);
    globalScore += partn / globalPartnership.length;
    globalTeamSkills.push(partn / globalPartnership.length)

    globalGoalOriented.forEach( (element) => {
      go += element;
    });
    console.log('Goal oriented: ' + go);
    globalScore += go / globalGoalOriented.length;
    globalTeamSkills.push(go / globalGoalOriented.length)

    globalQualityControl.forEach( (element) => {
      qc += element;
    });
    console.log('Quality Control: ' + qc);
    globalScore += qc / globalQualityControl.length;
    globalTeamSkills.push(qc / globalQualityControl.length)

    globalDevelopmentVelocity.forEach( (element) => {
      dv += element;
    });
    console.log(dv / globalDevelopmentVelocity.length);
    globalScore += dv / globalDevelopmentVelocity.length;
    globalTeamSkills.push(dv / globalDevelopmentVelocity.length)

    globalCommunication.forEach( (element) => {
      comm += element;
    });
    console.log(comm / globalCommunication.length);
    globalScore += comm / globalCommunication.length;
    globalTeamSkills.push(comm / globalCommunication.length)

    globalSuccess.forEach( (element) => {
      succ += element;
    });
    console.log(succ / globalSuccess.length);
    globalScore += succ / globalSuccess.length;
    globalTeamSkills.push(succ / globalSuccess.length)
  }
  
  setScores = () => {
    globalScore = 0;
    for(let i = 0 ; i < partnership.length ; i++)
    {
      score.partnership.score += (partnership[i].answer * (score.partnership.weight / partnership.length)) / 5;
    }
    console.log(score.partnership.score);
    globalScore += score.partnership.score;
  
    for(let i = 0 ; i < goalOriented.length ; i++)
    {
      score.goalOriented.score += (goalOriented[i].answer * (score.goalOriented.weight / goalOriented.length)) / 5;
    }
    console.log(score.goalOriented.score);
    globalScore += score.goalOriented.score;
  
    for(let i = 0 ; i < qualityControl.length ; i++)
    {
      score.qualityControl.score += (qualityControl[i].answer * (score.qualityControl.weight / qualityControl.length)) / 5;
    }
    console.log(score.qualityControl.score);
    globalScore += score.qualityControl.score;
  
    for(let i = 0 ; i < developmentVelocity.length ; i++)
    {
      score.developmentVelocity.score += (developmentVelocity[i].answer * (score.developmentVelocity.weight / developmentVelocity.length)) / 5;
    }
    console.log(score.developmentVelocity.score);
    globalScore += score.developmentVelocity.score;
  
    for(let i = 0 ; i < communication.length ; i++)
    {
      score.communication.score += (communication[i].answer * (score.communication.weight / communication.length)) / 5;
    }
    console.log(score.communication.score);
    globalScore += score.communication.score;
  
    for(let i = 0 ; i < success.length ; i++)
    {
      score.success.score += (success[i].answer * (score.success.weight / success.length)) / 5;
    }
    console.log(score.success.score);
    globalScore += score.success.score;
    //globalScore = 10;
    console.log(globalScore);
  }

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
            <Text style = {{fontWeight: 'bold', fontSize: 25}}>{Math.trunc(globalScore)}</Text>
          </View>

          {/* Client data View */}
          <View style = {{flexDirection: 'row', justifyContent:'center'}}>
            <Text>{this.state.clientDetails.Company} - </Text>
            <Text>{this.state.clientDetails.Name}</Text>
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
              <Text>{Math.trunc(globalTeamSkills[5])}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Partnership: </Text>
              <Text>{Math.trunc(globalTeamSkills[0])}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Goal oriented: </Text>
              <Text>{Math.trunc(globalTeamSkills[1])}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Quality: </Text>
              <Text>{Math.trunc(globalTeamSkills[2])}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Velocity: </Text>
              <Text>{Math.trunc(globalTeamSkills[3])}</Text>
            </View>

            <View style = {{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderBottomWidth: 1, 
              marginHorizontal: 50
            }}>
              <Text>Communication: </Text>
              <Text>{Math.trunc(globalTeamSkills[4])}</Text>
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