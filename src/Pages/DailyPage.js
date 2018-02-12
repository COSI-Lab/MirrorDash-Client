import React, { Component } from "react";

import Lokka from "lokka";
import { Transport } from "lokka-transport-http";

import SlideInDiv from "../Components/SlideInDiv";
import TimeChart from "../Components/TimeChart";

import TimeEntryContainer from "../Components/TimeEntryContainer";
import GridContainer from "../Components/GridContainer";

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
    let dayElems = <div>Loading...</div>;
    let txs = [];
    let rxs = [];

    if (this.state.days) {
      dayElems = this.state.days.map((day, x) => (
        <TimeEntryContainer timeEntry={day} key={x} />
      ));

      txs = this.state.days
        .map(day => {
          return {
            Time: day.date,
            "Transferred Bandwidth": day.tx,
            label: `Transferred: ${(day.tx / 1e12).toFixed(3)}TB\nRecieved: ${(
              day.rx / 1e12
            ).toFixed(3)}TB\nRate: ${day.rate.toFixed(2)}Mbit/s`
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
        <h2 style={{ color: "#4b4b4b", fontSize: "90%" }}>Daily Stats</h2>
        <GridContainer>
          <div className="griditem fullWidth">
            <h4 style={{ margin: 0, textAlign: "center" }}>Last 7 Days</h4>
            <TimeChart hour={false} txs={txs} rxs={rxs} />
          </div>
          {dayElems}
        </GridContainer>
      </SlideInDiv>
    );
  }
}

export default DailyPage;
