import React from 'react';
import { FlatList } from 'react-native';
import Question from './Question.js';
import Data from '../JSON/questions.json';

class Survey extends React.Component {
  state = {
    //check: [],
    checked: true,
    checkedList: [],
  };

  

  renderQuestion = ({index, item}) => {
    const onPressBox = () => {
      if(this.state.checkedList.includes(index)) {
        this.setState({
          checkedList: this.state.checkedList.filter((idx) => {
            return idx !== index;
          }),
        })
      }

      this.setState({
        checkedList: [...this.state.checkedList, index],
      });
    };

  
    return (
      <Question 
        title = {item.q} 
        checked = {!this.state.checkedList.includes(index)}
        onPress = {onPressBox}
      />
    );
  }

  render() {
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
/*
renderItem={({item}) =>
  <View style = {{margin: 10}}>
    <CheckBox 
      title = {item.q}
      checked = {this.state.checked}
      onIconPress = {this.onPress}
    />
  </View>

  () => this.setState({checked :item.id})
*/