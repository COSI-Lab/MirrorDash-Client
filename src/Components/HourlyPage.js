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

class HourlyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {hours: null};
        this.getData();
    }

    getData() {
        client.query(`
            {
                hours(last: 24) {
                    date
                    tx
                    rx
                    rate
                }
            }
        `).then(({hours}) => {
            this.setState(prevState => {
                return { hours };
            });
        });
    }

    render() {
        const hourStyle = {
            padding: 10,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
        }

        return (
            <SlideInDiv>
                <h2 style={{marginLeft: 30, marginBottom: -20, color: '#4b4b4b', fontSize: '100%'}}>Hourly Stats</h2>
                <ReactGridLayout
                    className="layout"
                    cols={4}
                    rowHeight={100}
                    width={960}
                    margin={[30, 30]}
                    isResizable={false}
                    isDraggable={false}>
                {this.state.hours && this.state.hours.map((hour, x) => (
                    <div style={hourStyle} key={x} data-grid={{x: x%4, y: Math.ceil(x/4), w: 1, h: 1}}>
                        <div style={{textAlign: 'center', fontSize: '110%', marginBottom: 10}}>{hour.date}</div>
                        <div>Transfer: {minimizeBytes(hour.tx)}</div>
                        <div>Recieve: {minimizeBytes(hour.rx)}</div>
                        <div>Rate: {hour.rate.toFixed(2)}Mbit/s</div>
                    </div>
                ))}
                </ReactGridLayout>
            </SlideInDiv>
        )
    }
}

export default HourlyPage;