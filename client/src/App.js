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
      // header
      scrollStatus: "",

      wallpapers: [],
      genre: "Lo-fi",

      backdropImage: "",
      backdropToggle: false,
      loadingBackdrop: false,
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", () => {
      let scrollStatus = "sticky";
      let backToTop = false;
      if (window.scrollY === 0) scrollStatus = "top";
      if (window.scrollY > 600) backToTop = true;

      this.setState({ scrollStatus, backToTop });
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", null);
  };

  changeTab = (event) => {
    const tabs = [
      "home",
      "twitter",
      "reddit",
      "instagram",
      "youtube",
      "trends",
      "settings",
    ];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ sidebar: false });
  };

  setAppState = async (name, value) => {
    await this.setState({ [name]: value });
  };

  toggle = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  alerts = () => {
    /*
    if (this.state.searchQueryBlankError)
      return (
        <Alert severity="error">
          Search query cannot be blank. Please enter a search query and try
          again.
        </Alert>
      );
    */
  };

  updateLocalStorage = (key, value) => {
    let userSettings = {};

    if (localStorage.getItem("userSettings"))
      userSettings = JSON.parse(localStorage.getItem("userSettings"));

    userSettings[key] = value;

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  };

  reset = async () => {
    await this.setState({});
  };

  imageBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("backdropToggle")}
        onClick={() => this.toggle("backdropToggle")}
      >
        <img src={this.state.backdropImage} alt="" />
      </Backdrop>
    );
  };

  loadingBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("loadingBackdrop")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  initialSearchBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("loadingBackdrop")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  backToTopButton = () => {
    return (
      <div className="back-to-top" onClick={() => this.scrollToTop()}>
        <KeyboardArrowUpIcon />
      </div>
    );
  };

  render() {
    return (
      <Box>
        <Dash
          state={this.state}
          setAppState={this.setAppState}
          updateLocalStorage={this.updateLocalStorage}
        />
        {this.state.backdropToggle && this.imageBackdrop()}
        {this.state.loadingBackdrop && this.loadingBackdrop()}
        {this.state.backToTop && this.backToTopButton()}{" "}
      </Box>
    );
  }
}
