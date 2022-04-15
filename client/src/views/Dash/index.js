import React, { Component } from "react";
import axios from "axios";
import { Box, Container, Radio } from "@mui/material";

import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import UserInput from "./components/UserInput";

export default class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    document.addEventListener("mousedown", this.handleClickOutside);
    /*
    if (this.props.state.wallpapers.length === 0) this.getWallpaper("lofi");
    console.log("wallpapers", this.props.state.wallpapers);
    */

    await this.auth();

    this.getGenres();

    //this.getWallpaper("lofi");
    //this.getRecommendations("lo-fi");
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeGenre = (event) => {
    const selectedGenre = event.currentTarget.getAttribute("data-genre");
    this.props.setAppState("genre", selectedGenre);
    this.setState({ filterToggle: false });
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  getWallpaper = async (genre) => {
    return await axios
      .put("/unsplash/get/wallpaper", {
        genre: genre,
      })
      .then(
        (response) => {
          //console.log(response);

          let wallpapers = this.props.state.wallpapers;
          wallpapers[genre] = response.data;
          this.props.setAppState("wallpapers", wallpapers);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getGenres = async () => {
    return await axios
      .put("/spotify/get/genres", {
        token: this.props.state.spotifyAuthToken,
      })
      .then(
        (response) => {
          console.log("genres", response);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getRecommendations = async (genre) => {
    return await axios
      .put("/spotify/get/recommendations", {
        genre: genre,
        token: this.props.state.spotifyAuthToken,
      })
      .then(
        (response) => {
          console.log("getRecommendations", response);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  auth = async () => {
    return await axios.put("/spotify/auth", {}).then(
      (response) => {
        console.log("auth", response);
        this.props.setAppState("spotifyAuthToken", response.data.access_token);
        return;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  filter = () => {
    return (
      <Box className="filter">
        <div
          className="active-display"
          onClick={() => this.toggle("filterToggle")}
        >
          <span className="active-filter">Favorites</span>
          <TuneRoundedIcon />
        </div>
        <ul
          className={"filter-options " + (this.state.filterToggle && "active")}
          ref={this.wrapperRef}
        >
          <li
            className={this.props.state.genre === "Lo-fi" ? "active" : ""}
            onClick={this.changeGenre}
            data-genre="Lo-fi"
          >
            Lo-fi
            <Radio checked={this.props.state.genre === "Lo-fi"} size="small" />
          </li>
          <li
            className={this.props.state.genre === "Hip-hop" ? "active" : ""}
            onClick={this.changeGenre}
            data-genre="Hip-hop"
          >
            Hip-hop
            <Radio
              checked={this.props.state.genre === "Hip-hop"}
              size="small"
            />
          </li>
        </ul>
      </Box>
    );
  };

  render() {
    const wallpapers = this.props.state.wallpapers;
    const genre = this.props.state.genre;

    //console.log("wallpaper for " + genre, wallpapers[genre]);

    return (
      <Container id="dashboard" maxWidth="100%">
        <div className="overlay" />

        <Box id="content">
          <h2>Radio</h2>

          <UserInput
            state={this.props.state}
            setAppState={this.props.setAppState}
            updateLocalStorage={this.props.updateLocalStorage}
          />
          {this.filter()}

          <h2>Current Genre: {this.props.state.genre}</h2>
        </Box>

        {wallpapers[genre] && (
          <img
            id="bg"
            src={wallpapers[genre].urls.regular}
            alt={wallpapers[genre].alt_description}
          />
        )}
      </Container>
    );
  }
}
