import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Slider } from 'react-native-elements';

class QuestionCard extends React.Component {
  
  state = {
    value: 3,
    sliderValue: ['Totalmente desacuerdo', 'Desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'],
  }

  updateState = (val) => {
    this.setState({
      value: val
    })
    this.props.onPress(val);
  }

  render() {
    return (
      <View style = {styles.container}>
        <View style = {{justifyContent: 'center', alignContent: 'center', backgroundColor: '#ffffff'}}>
          <Text style= {{alignSelf: 'center'}}>{this.props.question}</Text>
          <View style = {{alignSelf: 'center', width: '100%', alignItems: 'center'}}>
            <Slider 
              style = {styles.slider}
              value = {this.state.value}
              minimumValue = {1}
              maximumValue = {5}
              thumbTouchSize = {{width: 90, height: 90}}
              minimumTrackTintColor = {'#1077AC'}
              thumbTintColor = {'#CCCCCC'}
              step = {1}
              onValueChange = {value => this.updateState(value)}
            />
          </View>
          <Text style = {{alignSelf: 'center'}}>{this.state.sliderValue[this.state.value - 1]}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderRadius: 1,
    margin: '5%',
    width: '90%',
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
  slider: {
    width: '70%',
    //alignSelf: "stretch",
    //justifyContent: 'center',
  }
});

export default QuestionCard;
