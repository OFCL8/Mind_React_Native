import React from 'react';
import { Button, FlatList, View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingScreen from "../LoadingScreen";

var meanScore = 0;

export default class LeaderDetailsScreen extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      leaderDetails: {},
      loading: true,
      meanScore: 0
    }
  }

  leaderUID = '';
  scores = [];
  

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Leader Details';
    let headerRight = (<Button
    title="Options" 
    type="clear"
    color="blue"
    style={{fontSize: 15, color: 'white'}}
    onPress={()=>{ params.toggle(); }}>Options</Button>);
    return { headerTitle, headerRight };
  };

  setPickerValue (newValue) {
    this.props.navigation.setParams({pickerDisplayed: false});
    //Handles the selected value to navigate
    switch(newValue)
    {
      case 'editprofile':
        { 
            this.props.navigation.navigate("EditCTO");
        }
        break;
        case 'signout':
        { 
          firebase.auth().signOut();
        }
        break;
    }
  }

  togglePicker() {
    this.props.navigation.setParams({pickerDisplayed: !this.pickerDisplayed});
  }

  componentDidMount() {
    meanScore = 0;
    this.props.navigation.setParams({ toggle: this.togglePicker.bind(this), pickerDisplayed:false });
    this.setState({ leaderDetails: this.props.navigation.getParam('leaderDetails', 'NO-ID') });
    this.leaderUID = this.props.navigation.getParam('userUID');
    this.getUsers();
    this.setState({
      loading: false,
    });
  };
  
  leaderMeanScore = () => {
    for (let i = 0; i < this.scores.length; i++) {
      meanScore += this.scores[i].globalScore;
    }
    meanScore /= this.scores.length;
  }
  
  getUsers = () => {
    let gscore = db.collection('globalScores').where('liderUID','==',this.leaderUID);
    let getDoc = gscore.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
        snapshot.forEach(doc => {
          this.scores.push(doc.data());
        });
        this.leaderMeanScore();
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  renderScores = ({index, item}) => {
    
    return(
      <View style = {styles.flatListStyle}>
          <Text style = {styles.textStyle}>{item.company}</Text>
          <Text style = {styles.textStyle}>{item.globalScore}</Text>
      </View>
    );
  }

  render(){
    const { params } = this.props.navigation.state;
    const pickerValues = [
      {
        title: 'Edit My Profile',
        value: 'editprofile'
      },
      {
        title: 'Log Out',
        value: 'signout'
      }
    ]
    if(this.state.loading || params.pickerDisplayed==undefined){
      return <LoadingScreen/>;
    }else{
      return(
        <ScrollView contentContainerStyle = {styles.container}> 
          <View style = {{marginBottom: 20}}>
            <Text style = {{fontSize: 30, fontWeight: 'bold'}}>{parseFloat(meanScore.toFixed(2))}</Text>
          </View>
            <FlatList
              data = {this.scores}
              extraData = {this.state.loading}
              keyExtractor = {item => String(item.company)}
              renderItem = {this.renderScores}
            />

          <View>
            <Modal visible= {params.pickerDisplayed} animationType={"slide"} transparent={false}>
              <View style={styles.container}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 25 }}>Select Option</Text>
                { pickerValues.map((value, index) => {
                  return <TouchableOpacity key={ index } onPress={() => this.setPickerValue(value.value)} style={{ paddingTop: 4, paddingBottom: 4, alignItems: 'center' }}>
                        <Text style={{ fontSize: 25 }}>{value.title}</Text>
                    </TouchableOpacity>
                })}
                <TouchableOpacity onPress={()=>this.props.navigation.setParams({pickerDisplayed: false})} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <Text style={{ color: '#999', fontSize: 25 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
           </Modal>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
    marginBottom: 10
  },
  flatListStyle: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: '#FFF',
    color: '#000',
    margin: 10,
    borderRadius: 20,
    height: 50,
    borderWidth: 1,
  },
  textStyle: {
    fontSize: 18, fontWeight: 'bold', 
    marginHorizontal: 15,
  },
});