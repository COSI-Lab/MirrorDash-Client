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

class MonthlyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {months: null};
        this.getData();
    }

    getData() {
        client.query(`
            {
                months(last: 12) {
                    date
                    tx
                    rx
                    rate
                }
            }
        `).then(({months}) => {
            this.setState(prevState => {
                return { months };
            });
        });
    }

    render() {
        const monthStyle = {
            padding: 10,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
        }

        return (
            <SlideInDiv>
                <h2 style={{marginLeft: 30, marginBottom: -20, color: '#4b4b4b', fontSize: '100%'}}>Monthly Stats</h2>
                <ReactGridLayout
                    className="layout"
                    cols={2}
                    rowHeight={100}
                    width={960}
                    margin={[30, 30]}
                    isResizable={false}
                    isDraggable={false}>
                {this.state.months && this.state.months.map((month, x) => (
                    <div style={monthStyle} key={x} data-grid={{x: x%2, y: Math.ceil(x/2), w: 1, h: 1}}>
                        <div style={{textAlign: 'center', fontSize: '110%', marginBottom: 10}}>{month.date}</div>
                        <div>Transfer: {minimizeBytes(month.tx)}</div>
                        <div>Recieve: {minimizeBytes(month.rx)}</div>
                        <div>Rate: {month.rate.toFixed(2)}Mbit/s</div>
                    </div>
                ))}
                </ReactGridLayout>
            </SlideInDiv>
        )
    }
}

export default MonthlyPage;