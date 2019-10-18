import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, {Image, Circle,ClipPath} from 'react-native-svg';
import Animated, { Easing } from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';


const { width, height } = Dimensions.get('window');

const { block, cond, concat, Clock, clockRunning, debug, event, eq, Extrapolate, interpolate, set, startClock, stopClock, timing, Value} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
class ReactLogin extends Component {
  constructor() {
    super();

    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) => block([cond(eq(state, State.END),set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))])
      }
    ]);

    this.onCloseState = event([
      {
        nativeEvent: ({ state }) => block([cond(eq(state, State.END),set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))])
      }
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3 - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });

     this.textInputZIndex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP
    });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end'
        }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}>

          <Svg height={height + 50} width={width}>
            <ClipPath id="clip">
              <Circle r={height + 50} cx={width / 2} />
            </ClipPath>
            <Image
              clipPath="url(#clip)"
              href={require('../assets/bg.jpg')}
              height={height + 50}
              preserveAspectRatio="xMidYMid slice"
              width={width}
            />
          </Svg>
        </Animated.View>

        <View style={{ height: height / 5, justifyContent: 'center' }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}> 
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
        </View>

        <Animated.View style={{ 
          zIndex: this.textInputZIndex,
          opacity: this.textInputOpacity,
          transform:[{translateY:this.textInputY}],
          height: height/3, 
          ...StyleSheet.absoluteFill, 
          top:null, 
          justifyContent: 'center' 
          }}>

          <TapGestureHandler onHandlerStateChange={this.onCloseState}>
            <Animated.View style= {styles.closeButton}>
              <Animated.Text style={{ fontSize: 15, transform:[{ rotate: concat(this.rotateCross,'deg')}] }}>X</Animated.Text>
            </Animated.View>
          </TapGestureHandler>
              <TextInput
                placeholder="Email"
                style={styles.textInput}
                placeholderTextColor="black"
              />
              <TextInput
                placeholder="Password"
                style={styles.textInput}
                placeholderTextColor="black"
              />
          <Animated.View style={styles.button}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>SIGN IN</Text>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}
export default ReactLogin;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 35,
    height: 70,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    shadowOffset: {width:2, height:2},
    shadowColor: 'black',
    shadowOpacity: 0.2
  },
  closeButton:{
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    left: width / 2 - 20,
    position: 'absolute',
    shadowOpacity: 0.2,
    top: -20,
    width: 40
  },
  textInput:{
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 50,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingLeft: 10
  }
});