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
      {question: 0, status: true},
      {question: 1, status: true},
      {question: 2, status: true},
      {question: 3, status: true},
      {question: 4, status: true},
      {question: 5, status: true},
      {question: 6, status: true},
      {question: 7, status: true},
      {question: 8, status: true},
      {question: 9, status: true},
      {question: 10, status: true},
      {question: 11, status: true},
      {question: 12, status: true},
      {question: 13, status: true},
      {question: 14, status: true},
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

      try{
        // object = {...this.state.status}
        // console.log(object);
        const response = await db.collection('leaderSurvey').doc(String(this.state.idCliente)).set(this.state);      
        // .where('idLeader','==', 123)
        // .where('idCliente', '==', 234);

        console.log('Survey saved succesfully');
        alert('Survey saved succesfully','asdasdasd');
      }catch(e) {
        console.log(e);
        alert('Save failed');
      }
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