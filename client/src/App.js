import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect,
} from "react-router-dom";
//import moment from "moment";
//import ReactNotification from "react-notifications-component";
//import "react-notifications-component/dist/theme.css";

import { Backdrop, Box, CircularProgress } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./styles/main.css";

// components
import Dash from "./views/Dash";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallpapers: [],
      genre: "",

      spotifyAuthToken: "",
    };
  }

  setAppState = async (name, value) => {
    await this.setState({ [name]: value });
  };

  toggle = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  updateLocalStorage = (key, value) => {
    let userSettings = {};

    if (localStorage.getItem("userSettings"))
      userSettings = JSON.parse(localStorage.getItem("userSettings"));

    userSettings[key] = value;
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  };

  render() {
    return (
      <Box>
        <Dash
          state={this.state}
          setAppState={this.setAppState}
          updateLocalStorage={this.updateLocalStorage}
        />
      </Box>
    );
  }
}
