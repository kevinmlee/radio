import React, { Component } from "react";
//import moment from "moment";
import axios from "axios";

import { Box, Typography } from "@mui/material";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      recent: false,
      popular: true,
    };

    //this.wrapperRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    /*
    console.log("hELLO??");
    if (this.props.state.wallpapers.length === 0) this.getWallpaper();
    console.log("wallpapers", this.props.state.wallpapers);
    */
  };

  componentWillUnmount = () => {
    // document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tabs = ["recent", "popular"];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });
  };

  render() {
    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <img src="" alt="" />
        <h2>home</h2>
      </Box>
    );
  }
}
