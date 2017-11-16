import React, { Component } from "react";

import Lokka from "lokka";
import { Transport } from "lokka-transport-http";

import SlideInDiv from "./SlideInDiv";
import TimeChart from "./TimeChart";

import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import ReactGridLayout from "react-grid-layout";

import { minimizeBytes } from "../util";

const client = new Lokka({
  transport: new Transport("http://localhost:4000/graphql")
});

class MonthlyPage extends Component {
  constructor(props) {
    super(props);
    this.state = { months: null };
    this.getData();
  }

  getData() {
    client
      .query(
        `
            {
                months(last: 12) {
                    date
                    tx
                    rx
                    rate
                }
            }
        `
      )
      .then(({ months }) => {
        this.setState(prevState => {
          return { months };
        });
      });
  }

  render() {
    const monthStyle = {
      padding: 10,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      borderRadius: 5
    };

    let monthElems = <div>Loading...</div>;
    let txs = [];
    let rxs = [];

    if (this.state.months) {
      monthElems = this.state.months.map((month, x) => (
        <div
          style={monthStyle}
          key={x}
          data-grid={{ x: x % 3, y: 3 + Math.ceil(x / 3), w: 1, h: 1 }}
        >
          <div
            style={{ textAlign: "center", fontSize: "110%", marginBottom: 10 }}
          >
            {month.date}
          </div>
          <div>Transfer: {minimizeBytes(month.tx)}</div>
          <div>Recieve: {minimizeBytes(month.rx)}</div>
          <div>Rate: {month.rate.toFixed(2)}Mbit/s</div>
        </div>
      ));

      txs = this.state.months
        .map(month => {
          return {
            Time: month.date,
            "Transferred Bandwidth": month.tx,
            label: `Transferred: ${(month.tx / 1e12).toFixed(
              3
            )}TB\nRecieved: ${(month.rx / 1e12).toFixed(
              3
            )}TB\nRate: ${month.rate.toFixed(2)}Mbit/s`
          };
        })
        .reverse();

      rxs = this.state.months
        .map(month => {
          return {
            Time: month.date,
            "Recieved Bandwidth": month.rx
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
          Monthly Stats
        </h2>
        <ReactGridLayout
          className="layout"
          cols={3}
          rowHeight={100}
          width={960}
          margin={[30, 30]}
          isResizable={false}
          isDraggable={false}
        >
          <div
            style={monthStyle}
            key="graph"
            data-grid={{ x: 0, y: 0, w: 3, h: 3 }}
          >
            <h4 style={{ margin: 0, textAlign: "center" }}>Last 12 Months</h4>
            <TimeChart hour={false} txs={txs} rxs={rxs} />
          </div>
          {monthElems}
        </ReactGridLayout>
      </SlideInDiv>
    );
  }
}

export default MonthlyPage;
