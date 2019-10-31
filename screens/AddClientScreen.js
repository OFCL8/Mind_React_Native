import React from "react";
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

export default class AddClientScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
         <StatusBar backgroundColor="blue" barStyle="light-content" />
         <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate("HomeLeader")}>
           <Ionicons name="ios-arrow-round-back" size={32} color="#FFF"></Ionicons>
         </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
    marginBottom: 10
  },
  addbutton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    height: 60,
    justifyContent: 'center',
    left: width / 2 + 80,
    shadowOpacity: 0.2,
    top: -5,
    position: 'relative',
    width: 60
  },
  back: {
    position: "absolute",
    top: 48,
    left: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(21, 22, 48, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  }
});