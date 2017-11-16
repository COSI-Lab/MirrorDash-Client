import React, { Component } from "react";

import Lokka from "lokka";
import { Transport } from "lokka-transport-http";

import SlideInDiv from "../Components/SlideInDiv";
import TimeChart from "../Components/TimeChart";

import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import ReactGridLayout from "react-grid-layout";

import { minimizeBytes } from "../util";

const client = new Lokka({
  transport: new Transport("http://localhost:4000/graphql")
});

class HourlyPage extends Component {
  constructor(props) {
    super(props);
    this.state = { hours: null };
    this.getData();
  }

  getData() {
    client
      .query(
        `
            {
                hours(last: 24) {
                    date
                    tx
                    rx
                    rate
                }
            }
        `
      )
      .then(({ hours }) => {
        this.setState(prevState => {
          return { hours };
        });
      });
  }

  render() {
    const hourStyle = {
      padding: 10,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      borderRadius: 5
    };

    let hourElems = <div>Loading...</div>;
    let txs = [];
    let rxs = [];

    if (this.state.hours) {
      hourElems = this.state.hours.map((hour, x) => (
        <div
          style={hourStyle}
          key={x}
          data-grid={{ x: x % 4, y: 3 + Math.ceil(x / 4), w: 1, h: 1 }}
        >
          <div
            style={{ textAlign: "center", fontSize: "110%", marginBottom: 10 }}
          >
            {hour.date}
          </div>
          <div>Transfer: {minimizeBytes(hour.tx)}</div>
          <div>Recieve: {minimizeBytes(hour.rx)}</div>
          <div>Rate: {hour.rate.toFixed(2)}Mbit/s</div>
        </div>
      ));

      txs = this.state.hours
        .map(hour => {
          return {
            Time: hour.date.split(" ")[1],
            "Transferred Bandwidth": hour.tx,
            label: `Transferred: ${(hour.tx / 1e9).toFixed(
              3
            )}GB\nRecieved: ${(hour.rx / 1e9).toFixed(
              3
            )}GB\nRate: ${hour.rate.toFixed(2)}Mbit/s`
          };
        })
        .reverse();

      rxs = this.state.hours
        .map(hour => {
          return {
            Time: hour.date.split(" ")[1],
            "Recieved Bandwidth": hour.rx
          };
        })
        .reverse();
    }

    return (
      <SlideInDiv>
        <h2
          style={{
            marginLeft: 30,
            marginBottom: -20,
            color: "#4b4b4b",
            fontSize: "100%"
          }}
        >
          Hourly Stats
        </h2>
        <ReactGridLayout
          className="layout"
          cols={4}
          rowHeight={100}
          width={960}
          margin={[30, 30]}
          isResizable={false}
          isDraggable={false}
        >
          <div
            style={hourStyle}
            key="graph"
            data-grid={{ x: 0, y: 0, w: 4, h: 3 }}
          >
            <h4 style={{ margin: 0, textAlign: "center" }}>Last 24 Hours</h4>
            <TimeChart hour txs={txs} rxs={rxs} />
          </div>
          {hourElems}
        </ReactGridLayout>
      </SlideInDiv>
    );
  }
}

export default HourlyPage;
