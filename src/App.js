import React, { Component } from 'react';
import './App.css';

import Profile from './profile.jpg';

import MainStats from './Components/MainStats';
import DistroUsage from './Components/DistroUsage';
import StyledLink from './Components/StyledLink';

import {
  Route,
  Switch
} from 'react-router-dom';

const CouldNotFindPage = () => (
  <div>
    <h1>404</h1>
    <h2>Page Not found</h2>
  </div>
)

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav>
          <img src={Profile} />
          <StyledLink to="/">Overall</StyledLink>
          <StyledLink to="/distrousage">Distro Usage</StyledLink>
          <StyledLink to="/hourly">Hourly</StyledLink>
          <StyledLink to="/daily">Daily</StyledLink>
          <StyledLink to="/monthly">Monthly</StyledLink>
          <StyledLink to="/pb">PB Countdown</StyledLink>
        </nav>
        <section id="mainarea">
          <header>
            Mirror Stats
          </header>
          <main>
            <Switch>
              <Route exact path="/" component={MainStats} />
              <Route path="/distrousage" component={DistroUsage} />
              <Route component={CouldNotFindPage} />
            </Switch>
          </main>
        </section>
      </div>
    );
  }
}

export default App;
