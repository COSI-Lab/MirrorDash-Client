import Lokka from 'lokka';
import { Transport } from 'lokka-transport-http';
import React, { Component } from 'react';
import MirrorGrid from './MirrorGrid';

const client = new Lokka({
    transport: new Transport('http://localhost:4000/graphql')
});

class MainStats extends Component {
    constructor(props) {
      super(props);
      this.state = {
        topTen: null,
        topTenDate: null,
        days: null
      };
      this.getData();
    }

    getData() {
      client.query(`
        {
          distrousage(lastDays: 1, sortBiggest: true) {
            date
            distro
            bytes
            GB
          }
          days(last: 2) {
            date
            rx
            tx
            rate
          }
        }
        `).then(({distrousage, days}) => {
          const topTen = distrousage.slice(0, 10);
          const topTenDate = topTen[0].date;

          this.setState(prevState => {
            return {
              topTen,
              topTenDate,
              distrousage,
              days
            };
          })
        });
    }

    render() {
      return (
        <div>
          <h2>Overall Stats</h2>
          {this.state.topTen ?
            <MirrorGrid topTen={this.state.topTen} topTenDate={this.state.topTenDate} days={this.state.days}/>
          :
            <MirrorGrid />}
        </div>
      );
    }

}

export default MainStats;