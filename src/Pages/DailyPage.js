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

class DailyPage extends Component {
  constructor(props) {
    super(props);
    this.state = { days: null };
    this.getData();
  }

  getData() {
    client
      .query(
        `
            {
                days(last: 7) {
                    date
                    tx
                    rx
                    rate
                }
            }
        `
      )
      .then(({ days }) => {
        this.setState(prevState => {
          return { days };
        });
      });
  }

  render() {
    const dayStyle = {
      padding: 10,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      borderRadius: 5
    };

    let dayElems = <div>Loading...</div>;
    let txs = [];
    let rxs = [];

    if (this.state.days) {
      dayElems = this.state.days.map((day, x) => (
        <div
          style={dayStyle}
          key={x}
          data-grid={{ x: x % 2, y: 3 + Math.ceil(x / 2), w: 1, h: 1 }}
        >
          <div
            style={{ textAlign: "center", fontSize: "110%", marginBottom: 10 }}
          >
            {day.date}
          </div>
          <div>Transfer: {minimizeBytes(day.tx)}</div>
          <div>Recieve: {minimizeBytes(day.rx)}</div>
          <div>Rate: {day.rate.toFixed(2)}Mbit/s</div>
        </div>
      ));

      txs = this.state.days
        .map(day => {
          return {
            Time: day.date,
            "Transferred Bandwidth": day.tx,
            label: `Transferred: ${(day.tx / 1e12).toFixed(
              3
            )}TB\nRecieved: ${(day.rx / 1e12).toFixed(
              3
            )}TB\nRate: ${day.rate.toFixed(2)}Mbit/s`
          };
        })
        .reverse();

      rxs = this.state.days
        .map(day => {
          return {
            Time: day.date,
            "Recieved Bandwidth": day.rx
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
          Daily Stats
        </h2>
        <ReactGridLayout
          className="layout"
          cols={2}
          rowHeight={100}
          width={960}
          margin={[30, 30]}
          isResizable={false}
          isDraggable={false}
        >
          <div
            style={dayStyle}
            key="graph"
            data-grid={{ x: 0, y: 0, w: 2, h: 3 }}
          >
            <h4 style={{ margin: 0, textAlign: "center" }}>Last 7 Days</h4>
            <TimeChart hour={false} txs={txs} rxs={rxs} />
          </div>
          {dayElems}
        </ReactGridLayout>
      </SlideInDiv>
    );
  }
}

export default DailyPage;
