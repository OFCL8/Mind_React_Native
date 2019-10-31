import React from 'react';
import { FlatList } from 'react-native';
import Question from './Question.js';
import Data from '../JSON/questions.json';

class Survey extends React.Component {
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
  
  render() {
    let l = this.state.status;
    return (
      <FlatList
        data = {Data}
        extraData = {this.state}
        keyExtractor = {item => String(item.id)}
        renderItem = {this.renderQuestion}
      />
    );
  }
}

export default Survey;