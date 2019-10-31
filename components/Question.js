import React from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { CheckBox } from 'react-native-elements';
import data from '../JSON/questions.json';

class Question extends React.Component {

  render() {
    return(
      <CheckBox 
        title = {this.props.title}
        checked = {this.props.checked}
        onPress = {this.props.onPress}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 30
  },
});

export default Question;


/**
 <FlatList 
          data = {data}
          renderItem={({item}) =>
            <View style = {{margin: 10}}>
              <CheckBox 
                title = {item.q}
                checked = {this.state.checked}
                onIconPress = {this.onPress}
              />
            </View>
          }
          keyExtractor={(item, index) => index.toString()}      
          /> 
 */