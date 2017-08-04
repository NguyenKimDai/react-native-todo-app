import React, { Component } from "react";
import { StyleProvider } from "native-base";

import * as firebase from "firebase"; // Initialize Firebase
import getTheme from "../theme/components";
import material from "../theme/variables/commonColor";
import HomeScreen from "./components/HomeScreen";

const fireBaseconfig = {
  apiKey: "AIzaSyCcrphyjpheio32QufDa3c0JjCIOgdlnQ0",
  authDomain: "appnote-99ba6.firebaseapp.com",
  databaseURL: "https://appnote-99ba6.firebaseio.com",
  storageBucket: "appnote-99ba6.appspot.com"
};
const firebaseApp = firebase.initializeApp(fireBaseconfig);

export default class App extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <HomeScreen firebaseApp={firebaseApp} />
      </StyleProvider>
    );
  }
}
