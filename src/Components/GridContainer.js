import React, { Component } from "react";
import "./GridContainer.css";

class GridContainer extends Component {
  render() {
    return <div className="gridContainer">{this.props.children}</div>;
  }
}

export default GridContainer;
