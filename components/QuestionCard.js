import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';

var numbers = ['1','2','3','4','5'];

class QuestionCard extends React.Component {

  renderButton = ({index,item}) => {
  
    const answerQuestion = () => {
      this.props.onPress(index+1);
    }

    return(
      <TouchableHighlight style = {styles.button} onPress = {answerQuestion} >
        <Text style = {styles.buttonText}>{index+1}</Text>
      </TouchableHighlight>
    );
  }

  render() {
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

/*
<TouchableHighlight style = {styles.button} onPress = {() => console.log('1')}>
            <Text style = {styles.buttonText}>1</Text>
          </TouchableHighlight>
          <TouchableHighlight style = {styles.button} onPress = {() => console.log('2')}>
            <Text style = {styles.buttonText}>2</Text>
          </TouchableHighlight>
          <TouchableHighlight style = {styles.button} onPress = {() => console.log('3')}>
            <Text style = {styles.buttonText}>3</Text>
          </TouchableHighlight>
          <TouchableHighlight style = {styles.button} onPress = {() => console.log('4')}>
            <Text style = {styles.buttonText}>4</Text>
          </TouchableHighlight>
          <TouchableHighlight style = {styles.button} onPress = {() => console.log('5')}>
            <Text style = {styles.buttonText}>5</Text>
          </TouchableHighlight>
*/