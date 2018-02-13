import styled from "styled-components";
import React, { Component } from "react";
import Lokka from "lokka";
import { Transport } from "lokka-transport-http";
import SlideInDiv from "../Components/SlideInDiv";
import repoImages from "../Components/repoImages";

import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";

import ReactGridLayout from "react-grid-layout";

import { minimizeBytes } from "../util";

import Moment from "moment";

const client = new Lokka({
  transport: new Transport("http://localhost:4000/graphql")
});

const RepoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  height: 40px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  overflow: hidden;
  object-fit: contain;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 20px;
    text-align: left;
  }

  span {
    font-size: 20px;
  }

  img {
    height: auto;
    width: 60px;
  }

  .movement {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
`;

const Repo = props => {
  const { bytes } = props.distro;
  const repo = props.distro.distro;

  const positive = props.rankDiff > 0;
  const rankStr = positive ? (
    <span className="movement" style={{ color: "green" }}>
      &#9650;{props.rankDiff}
    </span>
  ) : props.rankDiff == 0 ? (
    <span className="movement">-0</span>
  ) : (
    <span className="movement" style={{ color: "red" }}>
      &#9660;{props.rankDiff * -1}
    </span>
  );

  return (
    <RepoContainer style={props.style} key={props.key}>
      <img
        src={repoImages[repo]}
        alt="logo"
        style={{
          paddingRight: 20
        }}
      />
      <div>
        <h3>
          {props.num}: {repo}
        </h3>
        <span>{minimizeBytes(bytes)}</span>
      </div>
      {rankStr}
    </RepoContainer>
  );
};

class DistroUsage extends Component {
  constructor(props) {
    super(props);
    this.state = { distrousage: null, rankData: null };
    this.getData();
  }

  getData() {
    client
      .query(
        `
          {
            distrousage(lastDays: 2, sortBiggest: true) {
              date
              distro
              bytes
              GB
            }
          }
        `
      )
      .then(({ distrousage }) => {
        const yesterdayDate = Moment()
          .subtract(1, "day")
          .format("MMM/D/YYYY");
        const twoDaysDate = Moment()
          .subtract(2, "days")
          .format("MMM/D/YYYY");

        const yesterdayData = distrousage.filter(
          entry => entry.date === yesterdayDate
        );
        const twoDaysData = distrousage.filter(
          entry => entry.date === twoDaysDate
        );

        const repos = yesterdayData.map(entry => entry.distro);

        const yestIdx = {};
        const twoDayIdx = {};

        for (let i = 0; i < 41; i++) {
          yestIdx[yesterdayData[i].distro] = i;
          twoDayIdx[twoDaysData[i].distro] = i;
        }

        const rankData = {};

        for (let repo of repos) {
          rankData[repo] = twoDayIdx[repo] - yestIdx[repo];
        }

        this.setState(prevState => {
          return { distrousage: yesterdayData, rankData };
        });
      });
  }

  render() {
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
          Daily Repository Stats
        </h2>
        {this.state.distrousage && (
          <ReactGridLayout
            className="layout"
            cols={4}
            rowHeight={60}
            width={1200}
            margin={[30, 30]}
            isResizable={false}
            isDraggable={false}
          >
            {this.state.distrousage.map((distro, x) => {
              return (
                <Repo
                  num={x + 1}
                  distro={distro}
                  key={x}
                  data-grid={{ x: x % 4, y: Math.ceil(x / 4), w: 1, h: 1 }}
                  rankDiff={this.state.rankData[distro.distro]}
                />
              );
            })}
          </ReactGridLayout>
        )}
      </SlideInDiv>
    );
  }
}

export default DistroUsage;
