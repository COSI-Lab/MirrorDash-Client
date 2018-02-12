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
    let hourElems = <div>Loading...</div>;
    let txs = [];
    let rxs = [];

    if (this.state.hours) {
      hourElems = this.state.hours.map((hour, x) => (
        <TimeEntryContainer timeEntry={hour} key={x} />
      ));

      txs = this.state.hours
        .map(hour => {
          return {
            Time: hour.date.split(" ")[1],
            "Transferred Bandwidth": hour.tx,
            label: `Transferred: ${(hour.tx / 1e9).toFixed(3)}GB\nRecieved: ${(
              hour.rx / 1e9
            ).toFixed(3)}GB\nRate: ${hour.rate.toFixed(2)}Mbit/s`
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
        <h2 style={{ color: "#4b4b4b", fontSize: "90%" }}>Hourly Stats</h2>
        <GridContainer>
          <div className="griditem fullWidth">
            <h4 style={{ margin: 0, textAlign: "center" }}>Last 24 Hours</h4>
            <TimeChart hour txs={txs} rxs={rxs} />
          </div>
          {hourElems}
        </GridContainer>
      </SlideInDiv>
    );
  }
}

export default HourlyPage;
