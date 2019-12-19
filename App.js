import React, { Fragment, useState, Component } from 'react';
import {SafeAreaView, ScrollView, View, Text, StatusBar, TextInput, Button ,StyleSheet} from 'react-native';
import DropdownMenu from "react-native-dropdown-menu";
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import languages from './src/shared/language_code';

{/*<View>*/}
{/*  <TextInput*/}
{/*      style={{height: 40, borderColor: 'gray', borderWidth: 1}}*/}
{/*      onChangeText={(text) => this.setState({input: text})}*/}
{/*  />*/}
{/*  <Text>{'user input: ' + this.state.input}</Text>*/}
{/*</View>*/}

export default class App extends Component {

  constructor(props){
    super(props);
    this.postTranslateService = this.postTranslateService.bind(this);

  }

  state = {
    inputText: '',
    returnText: '',
    text: '',
    dropdownOneSelect: 'Şu Dilden Çevir',
    dropdownTwoSelect: 'Şu Dile Çevir',
    codeOne: '',
    codeTwo: '',
  };

  postTranslateService = () =>  {
    console.log('1  '+this.state.codeOne);
    console.log('2  '+this.state.codeTwo);
    fetch('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190908T175021Z.23e59e5c7eeb7d41.400650556577aaaab85fd3c893c34e4cf200de9a&lang='+this.state.codeOne+'-'+this.state.codeTwo+'&text=' + this.state.inputText)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.text);
          this.setState({
            returnText : res.text
          });
        })
        .catch((error) => {
          console.log(error)
        });
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

  render() {
    const languageArray = [];

    Object.keys(languages).forEach(function(key) {
      languageArray.push(languages[key]);
    });

    const {inputText,returnText} = this.state;
    return(
          <MenuProvider style={{ padding: 30 }}>
            <View style={{flexDirection: "row"}}>
              <Menu onSelect={value => this.setOneCode(value)}>
                <MenuTrigger>
                  <Text style={styles.headerText}>{this.state.dropdownOneSelect}</Text>
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
            <View>
              <Menu onSelect={value => this.setTwoCode(value)}>
                <MenuTrigger>
                  <Text style={styles.headerText}>{this.state.dropdownTwoSelect}</Text>
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

          <View style={{paddingTop: 50}}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
              <ScrollView
                  contentInsetAdjustmentBehavior="automatic">
                <View>
                  <Text> En-Tr</Text>
                  <TextInput
                      numberOfLines={5}
                      multiline={true}
                      style={{ height: 120, borderColor: 'gray', borderWidth: 1 }}
                      onChangeText={(text) => this.setState({inputText: text})}
                  />
                  <Button
                      title="Translate"
                      color="#ff6600"
                      onPress={() => this.postTranslateService()}
                  />
                  <Text>{'Response: ' + returnText}</Text>
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
    backgroundColor: '#e4e4e4',
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
