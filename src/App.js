import React, { Component } from "react";
import "./App.css";

import Profile from "./profile.jpg";
import Ink from "react-ink";

import MainStats from "./Components/MainStats";
import DistroUsage from "./Components/DistroUsage";
import HourlyPage from "./Components/HourlyPage";
import DailyPage from "./Components/DailyPage";
import MonthlyPage from "./Components/MonthlyPage";
import AggregatePage from "./Components/AggregatePage";
import StyledLink from "./Components/StyledLink";

import { Route, Switch } from "react-router-dom";

const CouldNotFindPage = () => (
  <div>
    <h1>404</h1>
    <h2>Page Not found</h2>
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav>
          <img src={Profile} />
          <StyledLink to="/">
            <Ink />Overall
          </StyledLink>
          <StyledLink to="/distrousage">
            <Ink />Distro Usage
          </StyledLink>
          <StyledLink to="/hourly">
            <Ink />Hourly
          </StyledLink>
          <StyledLink to="/daily">
            <Ink />Daily
          </StyledLink>
          <StyledLink to="/monthly">
            <Ink />Monthly
          </StyledLink>
          <StyledLink to="/agg">
            <Ink />Agg. Stats
          </StyledLink>
        </nav>
        <section id="mainarea">
          <header>Mirror Stats</header>
          <main>
            <Switch>
              <Route exact path="/" component={MainStats} />
              <Route path="/distrousage" component={DistroUsage} />
              <Route path="/hourly" component={HourlyPage} />
              <Route path="/daily" component={DailyPage} />
              <Route path="/monthly" component={MonthlyPage} />
              <Route path="/agg" component={AggregatePage} />
              <Route component={CouldNotFindPage} />
            </Switch>
          </main>
        </section>
      </div>
    );
  }
}

export default App;
