import React, { Component } from "react";
import axios from "axios";
import { Container } from "@mui/material";

// components
import Home from "./components/Home";

export default class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      twitter: true,
      reddit: false,
    };
  }

  componentDidMount = async () => {
    if (this.props.state.wallpapers.length === 0) this.getWallpaper();
    console.log("wallpapers", this.props.state.wallpapers);
  };

  getWallpaper = async (genre) => {
    return await axios
      .put("/unsplash/get/wallpaper", {
        genre: genre,
      })
      .then(
        (response) => {
          console.log(response);

          console.log("url", response.data.urls);
          console.log("user", response.data.user);

          let wallpapers = this.props.state.wallpapers;
          wallpapers[genre] = response.data;
          this.props.setAppState("wallpapers", wallpapers);
          console.log("wallpapers", this.props.state.wallpapers);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  render() {
    return (
      <Container id="dashboard" maxWidth="100%">
        <h2>asdfdaa</h2>
        {/*
        {this.props.state.home && (
      <Home
            setAppState={this.props.setAppState}
            state={this.props.state}
            updateLocalStorage={this.props.updateLocalStorage}
          />
        )}*/}
      </Container>
    );
  }
}
