import React, { Component } from "react";
import "./App.css";

import Profile from "./profile.jpg";
import Ink from "react-ink";

import MainStats from "./Pages/MainStats";
import DistroUsage from "./Pages/DistroUsage";
import HourlyPage from "./Pages/HourlyPage";
import DailyPage from "./Pages/DailyPage";
import MonthlyPage from "./Pages/MonthlyPage";
import AggregatePage from "./Pages/AggregatePage";

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
          <StyledLink to="/">
            <Ink />Overall
          </StyledLink>
          <StyledLink to="/repousage">
            <Ink />Repo Usage
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
              <Route path="/repousage" component={DistroUsage} />
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
