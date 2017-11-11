import React, { Component } from 'react';
import './App.css';

import Profile from './profile.jpg';

import Lokka from 'lokka';
import styled from 'styled-components';
import { Transport } from 'lokka-transport-http';

import { minimizeBytes } from './util';

import MirrorGrid from './Components/MirrorGrid';

const client = new Lokka({
  transport: new Transport('http://localhost:4000/graphql')
});

const DistroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 80px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  h3 {
    margin-top: 0;
  }
`;

const DistrosGrid = styled.div`
  display: grid;
  width: 900px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;

class Distro extends Component {
  render() {
    const { distro, bytes } = this.props.distro;
    return (
      <DistroContainer>
        <h3>{distro}</h3>
        <span>{minimizeBytes(bytes)}</span>
      </DistroContainer>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {distrousage: null, topTen: null, topTenDate: null};
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
          distrousage,
          topTen,
          topTenDate,
          days
        }
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav>
          <img src={Profile} />
          <Link>Overall</Link>
          <Link>Distro Usage</Link>
          <Link>Hourly</Link>
          <Link>Daily</Link>
          <Link>Monthly</Link>
          <Link>PB Countdown</Link>
          <Link style={{color: "#cfcfcf"}}>New</Link>
        </nav>
        <section id="mainarea">
          <header>
            Mirror Stats
          </header>
          <main>
            <h2>Overall Stats</h2>
            {this.state.topTen ?
              <MirrorGrid topTen={this.state.topTen} topTenDate={this.state.topTenDate} days={this.state.days}/>
            :
              <MirrorGrid />}
            <h2>Daily Distro Stats</h2>
            <DistrosGrid>
              {this.state.distrousage && this.state.distrousage.map(distro => {
                return <Distro distro={distro}/>;
              })}
            </DistrosGrid>
          </main>
        </section>
      </div>
    );
  }
}

export default App;
