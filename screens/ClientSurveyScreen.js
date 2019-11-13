import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import QuestionCard from '../components/QuestionCard';
import Data from '../JSON/questions.json';

export default class ClientSurveyScreen extends React.Component {

  state = {
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
      {question: 14, status: false},
    ]
  }

  renderQuestion = ({index,item}) => {
    if(this.state.status[index].status){
      console.log('Index: ' + index)
      console.log('Question: ' + item.q);
      return(
        /*<QuestionCard
          question = {item.q}
          index = {index}
        />
        */
       <ScrollView>
          <QuestionCard
          question = {item.q}
          index = {index}
        />
        </ScrollView>
      )
    }
  }

  render() {
    return(
      <View>
      <FlatList
        data = {Data}
        keyExtractor = {item => String(item.id)}
        renderItem = {this.renderQuestion}
      />
      </View>
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