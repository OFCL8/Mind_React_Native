import React from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import QuestionCard from '../components/QuestionCard';
import Data from '../JSON/questions.json';
import * as firebase from 'firebase';


var answers = [
  {question: 0, answer: 0},
  {question: 1, answer: 0},
  {question: 2, answer: 0},
  {question: 3, answer: 0},
  {question: 4, answer: 0},
  {question: 5, answer: 0},
  {question: 6, answer: 0},
  {question: 7, answer: 0},
  {question: 8, answer: 0},
  {question: 9, answer: 0},
  {question: 10, answer: 0},
  {question: 11, answer: 0},
  {question: 12, answer: 0},
  {question: 13, answer: 0},
  {question: 14, answer: 0}
];

var months = [
  "January",
  "February", 
  "March", 
  "April", 
  "May", 
  "June", 
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];

export default class ClientSurveyScreen extends React.Component {

  state = {
    status: {},
    idLeader: '',
    idClient: '',
    date: {
      day: '',
      month: '',
      year: '',
    },
    loading: true,
    surveyAnswers: [
      {question: 0, answer: 0},
      {question: 1, answer: 0},
      {question: 2, answer: 0},
      {question: 3, answer: 0},
      {question: 4, answer: 0},
      {question: 5, answer: 0},
      {question: 6, answer: 0},
      {question: 7, answer: 0},
      {question: 8, answer: 0},
      {question: 9, answer: 0},
      {question: 10, answer: 0},
      {question: 11, answer: 0},
      {question: 12, answer: 0},
      {question: 13, answer: 0},
      {question: 14, answer: 0}
    ],
  }

  componentDidMount = async () => {

    try{
      db = await firebase.firestore();
      console.log('Connection succesfull');
    }catch(e){
      console.error(e);
      alert('aasas','asdasdasd');
    }

    this.setState({
      status: this.props.navigation.getParam('survey'),
      idClient: this.props.navigation.getParam('client'),
      idLeader: this.props.navigation.getParam('leader'),
    });
    this.setState({loading: false})
  }

  renderQuestion = ({index,item}) => {

    const onAnsweredQuestion = (num) => {
      this.state.surveyAnswers[index].answer = num;
      this.setState({
        surveyAnswers: this.state.surveyAnswers,
      });
    }

    if(!this.state.loading){
      if(this.state.status[index].status){
        return(
          <ScrollView>
            <QuestionCard
            question = {item.q}
            index = {index}
            onPress = {onAnsweredQuestion}
          />
          </ScrollView>
        )
      }
    }
  }

  sendSurvey = () => {
    this.setState({
      date:{
        day: new Date().getDate(),
        month: months[new Date().getMonth()],
        year: new Date().getFullYear(),
      }
    },async () => {
      
      try{
        const response = await db.collection('answeredSurveys').doc(String(this.state.idClient)).set(this.state);      
        console.log('Survey sended succesfully');
        alert('Survey saved succesfully','asdasdasd');

      }catch(e) {
        console.log(e);
        alert('Save failed');
      }
      this.props.getParam('isAnswered');
      console.log('sjdhhb')
    });
    this.props.navigation.navigate('HomeClient');
  }

  render() {
    return(
      <ScrollView>
      <FlatList
        data = {Data}
        extraData = {this.state.loading}
        keyExtractor = {item => String(item.id)}
        renderItem = {this.renderQuestion}
      />
      <Button title = 'Send' onPress = {this.sendSurvey}/>
      </ScrollView>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 25,
    width: '75%',
    height: '25%',
    backgroundColor: 'aliceblue'
  },
});