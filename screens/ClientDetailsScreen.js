import React from 'react';
import {View, Button, Flatlist, Text} from 'react-native';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import PopupMenu from '../components/PopupMenu';

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
          color="#4fa"
        />
      ),
    };
  };

  async componentDidMount(){
    db = firebase.firestore();
    this.setState({
      clientDetails: this.props.navigation.getParam('clientDetails', 'NO-ID')
    }, async () => {
      console.log('Awaiting data...');
      const data = await this.getData();
      //console.log('Get data finished!!!');
      // this.setState({
      //   loading: false,
      // })
    });
    console.log('setting params');
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
  
  getData = async () => {
    let temp = this.state.clientDetails.Company + this.state.clientDetails.Name;
    console.log('Trying to get: ' + temp);
    db
    .collection('answeredSurveys').where('name', '==', temp)
    .get()
    .then((query) => {
      if(query.exists){
        query.forEach(element => {
          console.log('Pushe data to question!!!');
          question.push(element.data());
        });
        console.log('Pushed all data!!!');
        this.analyzeData();
        console.log('Data analysed!!');
        this.setScores();
        console.log('Scores set');
        this.setState({
          loading: false,
        })
      }
    }).catch( (error) => {
      console.log('User not found', error);
      this.setState({
        loading: false,
      })
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
    score.partnership.score = 0;
    score.qualityControl.score = 0;
    score.communication.score = 0;
    score.developmentVelocity.score = 0;
    score.goalOriented.score = 0;
    score.success.score = 0;
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
            <Text style = {{fontWeight: 'bold', fontSize: 25}}>{globalScore}</Text>
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
          <View>
            <PopupMenu 
              visible = {this.state.modalVisible} 
              onPress = {this.changeValue} 
              onNav = {this.editSurvey}
            />
          </View>
        </ScrollView>
      );
    }
  }
}