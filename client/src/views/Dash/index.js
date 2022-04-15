import React, { Component } from "react";
import axios from "axios";
import { Box, Container, Radio } from "@mui/material";

import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const genres = {
  "Lo-fi": "5qap5aO4i9A",
  Piano: "y7e-GC6oGhg",
  "R&B / Chill Hip-hop": "Lq2pt_1Y6eQ",
};

export default class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,
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
    const wallpapers = this.props.state.wallpapers;
    const genre = this.props.state.genre;

    //console.log("wallpaper for " + genre, wallpapers[genre]);

    return (
      <Container id="dashboard" maxWidth="100%">
        <div className="overlay" />
        {/*<canvas id="static" className={genre ? "active" : ""}></canvas>*/}

        <Box id="content" sx={{ paddingTop: 4 }}>
          {this.filter()}
        </Box>

        <Box id="youtubeStream">
          <iframe
            id="ytplayer"
            className={genre ? "active" : ""}
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
          ></iframe>
        </Box>

        {/*<button id="playBtn" style={{ position: "relative", zIndex: 5 }}>
          Click to play
          </button>*/}

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
