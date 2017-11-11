import styled from 'styled-components';
import React, { Component } from 'react';
import Lokka from 'lokka';
import { Transport } from 'lokka-transport-http';

import { minimizeBytes } from '../util';

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

const Distro = (props) => {
    const { distro, bytes } = props.distro;
    return (
      <DistroContainer>
        <h3>{distro}</h3>
        <span>{minimizeBytes(bytes)}</span>
      </DistroContainer>
    );
}

class DistroUsage extends Component {
    constructor(props) {
        super(props);
        this.state = {distrousage: null};
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
          }
        `).then(({distrousage}) => {
          this.setState(prevState => {
            return { distrousage };
          })
        })
      }

      render() {
          return (
              <div>
                <h2>Daily Distro Stats</h2>
                <DistrosGrid>
                  {this.state.distrousage && this.state.distrousage.map(distro => {
                    return <Distro distro={distro}/>;
                  })}
                </DistrosGrid>
              </div>
          )
      }
}

export default DistroUsage;