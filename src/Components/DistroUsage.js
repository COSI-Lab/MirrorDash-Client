import styled from 'styled-components';
import React, { Component } from 'react';
import Lokka from 'lokka';
import { Transport } from 'lokka-transport-http';
import SlideInDiv from './SlideInDiv';

import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';

import ReactGridLayout from 'react-grid-layout';

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

const Distro = (props) => {
    const { distro, bytes } = props.distro;
    return (
      <DistroContainer style={props.style} key={props.key}>
        <h3>{props.num}: {distro}</h3>
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
            <SlideInDiv>
              <h2 style={{marginLeft: 30, marginBottom: -20, color: '#4b4b4b', fontSize: '100%'}}>Daily Distro Stats</h2>
              {this.state.distrousage &&
                <ReactGridLayout
                  className="layout"
                  cols={3}
                  rowHeight={100}
                  width={960}
                  margin={[30, 30]}
                  isResizable={false}
                  isDraggable={false}>
                  {
                    this.state.distrousage.map(
                      (distro, x) => <Distro num={x+1} distro={distro} key={x} data-grid={{x: x%3, y: Math.ceil(x/3), w: 1, h: 1}}/>
                    )
                  }
                </ReactGridLayout>
              }
            </SlideInDiv>
          );
      }
}

export default DistroUsage;