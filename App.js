import React from 'react';
import { StyleSheet} from 'react-native';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeLeaderScreen from './screens/HomeLeaderScreen';

import Firebase from './components/Firebase';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
  

//Functions to load assets
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor() {
    super()
    //If app is ready to show image
    this.state = {
      isReady: false
    }
  }

  componentWillMount() {
    Firebase.init();
  }
  
  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/bg.jpg'),
    ]);

    await Promise.all([...imageAssets]);
  }

  render() {
    //Checks if the state is not ready
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return <AppContainer />;
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//Defining SwitchNavigator for accesing screens in app
const AppSwitch = createSwitchNavigator({
  Home: HomeScreen,
  HomeLeader: HomeLeaderScreen
});

const AuthSwitch = createSwitchNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
});

const RootStack = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    App: AppSwitch,
    Auth: AuthSwitch
  },
  {
    initialRouteName: 'Loading',
  }
  );
//AppContainer that contains the pages
const AppContainer = createAppContainer(RootStack);





