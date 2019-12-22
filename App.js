import React, {Component} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger} from "react-native-popup-menu";
import languages from './src/shared/language_code';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';


export default class App extends Component {


  constructor(props){
    super(props);
    this.postTranslateService = this.postTranslateService.bind(this);
    this.dropdownChange = this.dropdownChange.bind(this);
    this.speak = this.speak.bind(this);

  }
  speak = (text) => {
    console.log(text[0]);
      Speech.speak(text[0]);
  };
  state = {
    inputText: '',
    returnText: '',
    text: '',
    dropdownOneSelect: 'Türkçe',
    dropdownTwoSelect: 'English',
    codeOne: 'tr',
    codeTwo: 'en',
    translateWork : []
  };

  postTranslateService = () =>  {

    fetch('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190908T175021Z.23e59e5c7eeb7d41.400650556577aaaab85fd3c893c34e4cf200de9a&lang='+this.state.codeOne+'-'+this.state.codeTwo+'&text=' + this.state.inputText)
        .then((res) => res.json())
        .then((res) => {
          let array = [];
          array = this.state.translateWork.concat(res.text);
          this.setState({
            returnText : res.text,
            translateWork: array
          });
          // this.setTranslateWork(res.text);

        })
        .catch((error) => {
          console.log(error)
        });
  };

  setTranslateWork = () => {

    this.setState(state => {
      this.state.translateWork.push(this.state.returnText);
    })
  };


  setOneCode = (value) => {
    const languageArray = [];
    let code = '';
    Object.keys(languages).forEach(function(key) {
      languageArray.push(languages[key]);
    });
    languageArray.forEach((res)=> {
      if(res.name === value ) {
        code = res.code;
      }
    });
    this.setState({codeOne: code});
    this.setState({dropdownOneSelect:value});
  };

  setTwoCode = (value) => {
    const languageArray = [];
    let code = '';
    Object.keys(languages).forEach(function(key) {
      languageArray.push(languages[key]);
    });
    languageArray.forEach((res)=> {
      if(res.name === value ) {
        code = res.code;
      }
    });
    this.setState({codeTwo: code});
    this.setState({dropdownTwoSelect:value});
  };

  dropdownChange = () => {

    let oneCode = this.state.codeOne;
    let oneName = this.state.dropdownOneSelect;

    this.setState({
      dropdownOneSelect : this.state.dropdownTwoSelect,
      codeOne : this.state.codeTwo,
      dropdownTwoSelect : oneName,
      codeTwo : oneCode
    });
  };

  deleteElement = (text) => {
    this.state.translateWork.splice(this.state.translateWork.indexOf(text),1);
    let array = this.state.translateWork;
    this.setState({
      translateWork : array
    });
  };

  showAlert = () => {
    alert("Please enter text");
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    const languageArray = [];

    Object.keys(languages).forEach(function(key) {
      languageArray.push(languages[key]);
    });

    const {inputText,returnText} = this.state;
    return(
          <MenuProvider>
            <View style={{paddingTop: 24, flexDirection: 'row'}}>
              <View style={{backgroundColor: '#0984e3', flexDirection:'row', paddingTop:15}}>
                <Icon name="align-justify" color="white" size={24} style={{paddingTop:7 , paddingLeft: 10}} />
                <Text style={{ height: 50 , fontSize: 24, color: 'white', width: 4000}}> TRANSLATE</Text>
              </View>
            </View>
            <View style={menuStyle.menuContainer}>
              <View style={menuStyle.dropdownMenu}>
                <Menu onSelect={value => this.setOneCode(value)}>
                  <MenuTrigger>
                    <Text style={menuStyle.headerText}>{this.state.dropdownOneSelect}</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    {languageArray.map( item =>
                        <MenuOption value={item.name}>
                          <Text style={styles.menuContent}>{item.name}</Text>
                        </MenuOption>
                    )}
                  </MenuOptions>
                </Menu>
              </View>
              <TouchableHighlight onPress={this.dropdownChange}>
                <View onPress={ () => this.state.dropdownOneSelect }>
                  <Icon name="exchange" color="#0984e3" size={30}  />
                </View>
              </TouchableHighlight>
              <View>
                <Menu onSelect={value => this.setTwoCode(value)}>
                  <MenuTrigger style={{paddingLeft:20}}>
                    <Text style={menuStyle.headerText}>{this.state.dropdownTwoSelect}</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOptions>
                      {languageArray.map( item =>
                          <MenuOption value={item.name}>
                            <Text style={styles.menuContent}>{item.name}</Text>
                          </MenuOption>
                      )}
                    </MenuOptions>
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          <View>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
              <ScrollView
                  contentInsetAdjustmentBehavior="automatic">
                <View style={{flexDirection: "column" , paddingRight: 2, paddingLeft: 2}}>
                  <TextInput
                      placeholder={"Enter text to convert\n"}
                      numberOfLines={5}
                      multiline={true}
                      style={{ height: 120, borderWidth: 3  , fontSize:22 , borderColor: "#636e72", paddingLeft: 8, paddingRight: 8}}
                      onChangeText={(text) => this.setState({inputText: text})}
                  />
                  <View style={{width: 400,justifyContent: "center",alignItems:"center", paddingTop:20,paddingBottom:20}}>
                    { this.state.inputText === '' ? <Button
                        title="Translate"
                        color="#d63031"
                        onPress={() => this.showAlert()}
                    /> : <Button
                        title="Translate"
                        color="#0984e3"
                        onPress={() => this.postTranslateService()}
                    />}
                  </View>
                  <View>
                    {this.state.returnText === '' ? null :
                        <View style={{borderWidth: 3, height:200,backgroundColor:"#0984e3", borderColor: "white" ,flexDirection: "row"}}>
                          <View style={{flex: 0.97}}>
                            <Text style={{fontSize:22,color: "white", paddingLeft: 10, paddingTop: 10}}>{returnText}</Text>
                          </View>
                          <View style={{paddingTop: 10}}>
                            <Icon name="volume-up" size={40}  color="white" onPress={ () => this.speak(this.state.returnText) }/>
                          </View>
                        </View>
                    }
                  </View>
                  <View>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{paddingLeft: 2, paddingRight: 2}}>
                      { this.state.translateWork.reverse().map(text => {
                        return  <View style={{borderWidth: 3 , borderColor: "#0984e3" , height:50, flexDirection: "row" , flex: 1, marginTop:5 }}>
                          <View style={{flex: 0.98}}>
                            <Text style={{fontSize:20,color: "black", paddingLeft: 10, paddingTop: 10}}>{text}</Text>
                          </View>
                          <View>
                            <Icon name="trash" color="#0984e3" size={30}  onPress={ () => this.deleteElement(text) } style={{paddingTop: 6}}/>
                          </View>
                        </View>;
                      })}
                    </View>
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
          </MenuProvider>
    )
  }


};

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    backgroundColor: '#7f8fa6',
    flex: 1
  },
  header: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
  },
  menuContent: {
    color: "#000",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  }
});

const menuStyle= StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    paddingTop: 30,
    borderWidth: 1,
    borderColor: "#636e72",
    paddingBottom: 30,
    paddingLeft: 2,
    paddingRight: 2
  },
  dropdownMenu: {
    paddingRight: 15,
    paddingLeft: 110,
  },
  dropdownTwo: {
    paddingLeft: 15
  },
  headerText: {
    color: "#636e72",
    fontSize: 20
  }
});
