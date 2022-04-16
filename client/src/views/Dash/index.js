import React, { Component } from "react";
import axios from "axios";
import { Box, Container, Radio } from "@mui/material";

import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const genres = {
  "Chillout Lounge": "9UMxZofMNbA",
  "Coffee Shop": "-5KAN9_CzSA",
  "Jazz Piano": "Dx5qFachd3A",
  "Lo-fi": "5qap5aO4i9A",
  Piano: "y7e-GC6oGhg",
  "R&B / Chill Hip-hop": "Lq2pt_1Y6eQ",
};

export default class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      playing: false,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.changeGenre = this.changeGenre.bind(this);
  }

  componentDidMount = async () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    // append static script
    /*
    const staticScript = document.createElement("script");
    staticScript.src = "/js/static.js";
    staticScript.async = true;
    document.body.appendChild(staticScript);
    */

    // append youtube script
    const script = document.createElement("script");
    script.src = "/js/youtube.js";
    script.async = true;
    document.body.appendChild(script);
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
    this.setState({ filterToggle: false, playing: true });
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
    const changeGenre = this.changeGenre;
    const currentGenre = this.props.state.genre;

    return (
      <Box className="filter">
        <div
          className="active-display"
          onClick={() => this.toggle("filterToggle")}
        >
          <span className="active-filter">
            {currentGenre ? currentGenre : "Genres"}
          </span>
          <LibraryMusicIcon />
        </div>
        <ul
          className={"filter-options " + (this.state.filterToggle && "active")}
          ref={this.wrapperRef}
        >
          {Object.keys(genres).map(function(genre, i) {
            return (
              <li
                className={currentGenre === genre ? "active" : ""}
                onClick={changeGenre}
                data-genre={genre}
              >
                {genre}
                <Radio checked={currentGenre === genre} size="small" />
              </li>
            );
          })}
        </ul>
      </Box>
    );
  };

  render() {
    const genre = this.props.state.genre;

    return (
      <Container id="dashboard" maxWidth="100%">
        <Box id="content" sx={{ paddingTop: 4 }}>
          {this.filter()}

          <div className="controls">
            <div
              className={
                "bars audio-wrapper random " +
                (this.state.playing ? "active" : "")
              }
            >
              <div className="bar-1"></div>
              <div className="bar-2"></div>
              <div className="bar-3"></div>
              <div className="bar-4"></div>
              <div className="bar-5"></div>
            </div>

            <div className="controllers">
              <PlayArrowIcon
                id="play"
                className={"play-pause " + (this.state.playing ? "" : "active")}
                onClick={() => this.setState({ playing: true })}
              />
              <PauseIcon
                id="pause"
                className={"play-pause " + (this.state.playing ? "active" : "")}
                onClick={() => this.setState({ playing: false })}
              />
            </div>

            <div className="volume-controls">
              <VolumeDownIcon />
              <input id="volume" min="0" max="100" type="range" />
              <VolumeUpIcon />
            </div>
          </div>
        </Box>

        <div class="tv-container">
          <iframe
            id="ytplayer"
            className={"screen " + (genre ? "active" : "")}
            width="560"
            height="315"
            src={
              "https://www.youtube-nocookie.com/embed/" +
              genres[genre] +
              "?controls=0&autoplay=0&mute=0&loop=1&showinfo=0&autohide=1&modestbranding=1&rel=0&enablejsapi=1"
            }
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay"
          />
          <div class="tv-overlay" />
        </div>

        {/*<button id="playBtn" style={{ position: "relative", zIndex: 5 }}>
          Click to play
          </button>*/}
      </Container>
    );
  }
}
