import React, { Component } from "react";

import Lokka from "lokka";
import { Transport } from "lokka-transport-http";

import SlideInDiv from "../Components/SlideInDiv";

import { minimizeBytes } from "../util";

import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import ReactGridLayout from "react-grid-layout";

const client = new Lokka({
  transport: new Transport("http://localhost:4000/graphql")
});

class AggregatePage extends Component {
  constructor(props) {
    super(props);
    this.state = { total: null, monthRate: null };
    this.getData();
  }

  getData() {
    client
      .query(
        `{
          total {
            total
          }
          months(last: 1) {
            rate
          }
        }`
      )
      .then(({ total, months }) => {
        this.setState(prevState => {
          return {
            total: total.total,
            monthRate: months[0].rate
          };
        });
      });
  }

  render() {
    const aggStyle = {
      padding: 10,
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      borderRadius: 5
    };

    const layout = [
      { i: "total", x: 0, y: 0, w: 2, h: 1 }
      // { i: "topday", x: 0, y: 1, w: 1, h: 1 }
    ];

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
          Aggregate Stats
        </h2>
        <ReactGridLayout
          className="layout"
          cols={3}
          rowHeight={100}
          width={960}
          margin={[30, 30]}
          isResizable={false}
          isDraggable={false}
          layout={layout}
        >
          <div style={aggStyle} key="total">
            Total since April 24, 2016: 7 BYTES
            <br />
            At this rate of N Mbit/s, we will hit 1PB on Soon™️
          </div>
          {/* <div style={aggStyle} key="topday">
            foo
          </div> */}
        </ReactGridLayout>
        {/* {this.state.total && (
          <div style={aggStyle}>Total: {minimizeBytes(this.state.total)}</div>
        )} */}
      </SlideInDiv>
    );
  }
}

export default AggregatePage;
