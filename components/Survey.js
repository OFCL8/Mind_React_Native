import React from 'react';
import { FlatList, Button, View} from 'react-native';
import Question from './Question.js';
import Data from '../JSON/questions.json';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
import Firebase from './Firebase';
import { ScrollView } from 'react-native-gesture-handler';

var months = ["January",
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
"December"];

class Survey extends React.Component {

  componentDidMount = async () => {
    try{
      db = await firebase.firestore();
      console.log('Connection succesfull');
    }catch(e){
      console.error(e);
      alert('aasas','asdasdasd');
    }

    this.setState({
      idCliente: (this.props.navigation.getParam('company') + this.props.navigation.getParam('name')),
      idLeader: this.props.navigation.getParam('leaderID')
    });

  }

  state = {
    idLeader: '',
    idCliente: '',
    answered: false,
    date: {
      day: '',
      month: '',
      year: '',
    },
    status: [
      {question: 0, status: true, teamskill: [2,4]},
      {question: 1, status: true, teamskill:[2]},
      {question: 2, status: true, teamskill:[3]},
      {question: 3, status: true, teamskill:[4]},
      {question: 4, status: true, teamskill:[5]},
      {question: 5, status: true, teamskill:[1]},
      {question: 6, status: true, teamskill:[2]},
      {question: 7, status: true, teamskill:[3]},
      {question: 8, status: true, teamskill:[4]},
      {question: 9, status: true, teamskill:[5]},
      {question: 10, status: true, teamskill:[1]},
      {question: 11, status: true, teamskill:[2]},
      {question: 12, status: true, teamskill:[3]},
      {question: 13, status: true, teamskill:[1]},
      {question: 14, status: true, teamskill:[6]},
    ],
  };

  renderQuestion = ({index, item}) => {
    const onPressBox = () => {
      if(this.state.status[index].status == true) {
        this.state.status[index].status = false;
        this.setState({
          status: this.state.status,
        })
      }
      else {
        this.state.status[index].status = true;
        this.setState({
          status: this.state.status,
        })
      }
    };
    
    return (
      <Question 
        title = {item.q} 
        checked = {this.state.status[index].status}
        onPress = {onPressBox}
      />
    );
  }

  saveSurvey = () => {
    this.setState({
      date:{
        day: new Date().getDate(),
        month: months[new Date().getMonth()],
        year: new Date().getFullYear(),
      }
    },async () => {
      var count = this.state.status.filter( s => {return s.status}).length;
      if(count >= 1){
        try{
          const response = await db.collection('leaderSurvey').doc(String(this.state.idCliente)).set(this.state);      
          this.props.navigation.goBack(null);
          alert('Survey saved succesfully');
        }catch(e) {
          console.log(e);
          alert('Save failed');
        }
      }
      else
        alert('Select at least one question.');
    });
  }
  
  render() {
    let l = this.state.status;
    return (
      <ScrollView>
        <FlatList
          data = {Data}
          extraData = {this.state}
          keyExtractor = {item => String(item.id)}
          renderItem = {this.renderQuestion}
        />
        <Button 
          title = 'Save'
          onPress = {this.saveSurvey}
        />
      </ScrollView>
    );
  }
}

export default Survey;