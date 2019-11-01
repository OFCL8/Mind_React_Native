import React from 'react';
import { FlatList, Button, View} from 'react-native';
import Question from './Question.js';
import Data from '../JSON/questions.json';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';
import Firebase from './Firebase';

// const firebaseConfig = {
//   apiKey: "AIzaSyAILjr3lHU1uDpN0u_-g4dAN_h6FCNgB9A",
//   authDomain: "mindreactnative-76991.firebaseapp.com",
//   databaseURL: "https://mindreactnative-76991.firebaseio.com",
//   projectId: "mindreactnative-76991",
//   storageBucket: "mindreactnative-76991.appspot.com",
//   messagingSenderId: "354780949033",
//   appId: "1:354780949033:web:c49345ca0859a332df0a38"
// };

//firebase.initializeApp(firebaseConfig);
//db = firebase.firestore();
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
  }

  state = {
    idLeader: 123,
    idCliente: 234,
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
      {question: 14, status: false}
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
        const response = await db.collection("cities").doc("New Jersey").set(this.state);      
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
      <View>
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
      </View>
    );
  }
}

export default Survey;