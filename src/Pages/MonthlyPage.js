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
    let monthElems = <div>Loading...</div>;
    let txs = [];
    let rxs = [];

    if (this.state.months) {
      monthElems = this.state.months.map((month, x) => (
        <TimeEntryContainer timeEntry={month} key={x} />
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
        <h2 style={{ color: "#4b4b4b", fontSize: "90%" }}>Monthly Stats</h2>
        <GridContainer>
          <div className="griditem fullWidth">
            <h4 style={{ margin: 0, textAlign: "center" }}>Last 12 Months</h4>
            <TimeChart hour={false} txs={txs} rxs={rxs} />
          </div>
          {monthElems}
        </GridContainer>
      </SlideInDiv>
    );
  }
}

export default MonthlyPage;
