import React from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default class PopupMenu extends React.Component {
  
  render() {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={this.props.onPress}
        >
          <View style = {styles.container}>
            <TouchableHighlight>
              <Text style = {styles.text}>Client options</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress = {this.props.onNav}>
              <Text style = {styles.text}>Edit survey</Text>
            </TouchableHighlight>
            
            <TouchableHighlight>
              <Text style = {styles.text}>Edit client info</Text>
            </TouchableHighlight>
          </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
  }
});