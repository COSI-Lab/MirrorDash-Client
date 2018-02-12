import React, { Component } from "react";

import { minimizeBytes } from "../util";

import "./TimeEntryStats.css";

class TimeEntryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { timeEntry: props.timeEntry };
  }

  render() {
    const contStyle = {
      padding: 10,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      borderRadius: 5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      backgroundColor: "white",
      ...this.props.style
    };

    const { date, tx, rx, rate } = this.state.timeEntry;

    return (
      <div className="griditem" style={contStyle}>
        <span
          style={{ textAlign: "center", fontSize: "110%", marginBottom: 32 }}
        >
          {date}
        </span>
        <div className="timeentry_stats">
          <div>
            {minimizeBytes(tx + rx)}
            <span>Total</span>
          </div>
          <div>
            {minimizeBytes(tx)}
            <span>Tx</span>
          </div>
          <div>
            {minimizeBytes(rx)}
            <span>Rx</span>
          </div>
          <div>
            {rate.toFixed(2)}Mbit/s
            <span>Rate</span>
          </div>
        </div>
      </div>
    );
  }
}

export default TimeEntryContainer;
