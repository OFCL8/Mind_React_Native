import React from 'react';
import {View, Button, Flatlist, Text} from 'react-native';
import * as firebase from 'firebase';
import * as store from 'firebase/firestore';


export default class ClientDetailsScreen extends React.Component{
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Detalles del cliente',
      headerRight: () => (
        <Button
          onPress={navigation.getParam("editSurvey")}
          title="Edit Survey"
          color="#4fa"
        />
      ),
    };
  };

  componentDidMount(){
    this.props.navigation.setParams({editSurvey: this.editSurvey});
  }

  editSurvey = () => {
    console.log('edit survey')
    this.props.navigation.navigate("EditSurvey");
  }
  
  render(){
    console.log('Entered details screen');
    return(
      <View style = {{flex: 1, justifyContent: 'center'}}>
        <Text>Details screen</Text>
        <Button 
          title = "Editar encuesta"
          onPress = {this.editSurvey}
        />
      </View>
    );
  }
}