import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';

var numbers = ['1','2','3','4','5'];

class QuestionCard extends React.Component {

  state = {
    selected: [false,false,false,false,false],
    select: false,
    refresh: false,
    prevSelect: 0,
  }

  renderButton = ({index,item}) => {
  
    const answerQuestion = () => {
      this.props.onPress(index+1); 

      if(this.state.select === true) {
        this.state.selected[this.state.prevSelect] = false;
      }
      
      this.state.selected[index] = !this.state.selected[index];
      this.state.select = true;
      this.state.prevSelect = index;

      this.setState({
        selected: this.state.selected, 
        select: this.state.select,
        refresh: !this.state.refresh,
        prevSelect: this.state.prevSelect,
      });
    }

    return(
      <TouchableHighlight style = {this.state.selected[index] ? styles.buttonSelected : styles.button} onPress = {answerQuestion} >
        <Text style = {styles.buttonText}>{index+1}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    console.log('\n\nselected: ' + this.state.selected + '\nselect: ' + this.state.select + '\nprevSelect: ' + this.state.prevSelect);
    return (
      <View style = {styles.container}>
        <Text style = {styles.text}>{this.props.question}</Text>
        <View 
          style = {{
            
            flexDirection: 'row', 
            justifyContent: 'space-evenly', 
            alignItems: 'flex-end', 
            marginBottom: 10}}
        >
          <FlatList
            data = {numbers}
            extraData = {this.state.refresh}
            renderItem = {this.renderButton}
            numColumns = {5}
            keyExtractor = {(item,index) => index.toString()}
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 25,
    width: '75%',
    height: '70 %',
    backgroundColor: 'aliceblue'
  },
  button: {
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    width: 50,
    margin: 2
  },
  buttonSelected: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 50,
    margin: 2
  },
  text: {
    fontSize: 18,
    margin: 5,
    textAlign: 'justify'
  },
  question: {
    marginLeft:5,
    fontSize: 20
  },
  buttonText: {
    color: 'white', 
    textAlign: 'center'
  },
});

export default QuestionCard;
