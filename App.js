import React from 'react';
import MainScreen from './screens/MainScreen';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeLeaderScreen from './screens/HomeLeaderScreen';
import HomeClientScreen from './screens/HomeClientScreen';
import HomeCTOScreen from './screens/HomeCTOScreen';
import AddClientScreen from './screens/AddClientScreen';
import AddCTOScreen from './screens/AddCTOScreen';
import ClientDetailsScreen from './screens/ClientDetailsScreen';
import LeaderDetailsScreen from './screens/LeaderDetailsScreen';
import EditSurveyScreen from './components/Survey';
import ClientsurveyScreen from './screens/ClientSurveyScreen';

import Firebase from './components/Firebase';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
  
import * as firebase from 'firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isReady: false,
      isUser: false,
      user: null,
    }
    Firebase.init();
  }
  

  componentDidMount() {
    this.authListener();
  }

  authListener = () => {
    let self = this;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //User is logged
        self.setState({user});
      }
      else {
        //User is not logged
        self.setState({user:null});
      }
    this.setState({"isReady":true});
    })
  }
  render() {
    //Checks if the state is not ready
    if(!this.state.isReady) {
      return <LoadingScreen/>
    }
    //If user is logged return Home, if not, return Login Screen
    return (this.state.user ? (<AppContainer/>) : (<LoginScreen/>));
  }

}

//Defining StackNavigator for accesing screens in app
const RootStack = createStackNavigator(
  {
    Loading:LoadingScreen,
    Login: LoginScreen,
    Main: MainScreen,
    HomeLeader: HomeLeaderScreen,
    HomeClient: HomeClientScreen,
    HomeCTO: HomeCTOScreen,
    AddClient: AddClientScreen,
    AddCTO: AddCTOScreen,
    DetailsClient: ClientDetailsScreen,
    DetailsLeader: LeaderDetailsScreen,
    EditSurvey: EditSurveyScreen,
    ClientSurvey: ClientsurveyScreen,
  },
  {
    initialRouteName: 'Main',
  }
  );
//AppContainer that contains the pages
const AppContainer = createAppContainer(RootStack);





