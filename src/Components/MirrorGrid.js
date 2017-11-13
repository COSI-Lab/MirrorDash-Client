import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';

import ReactGridLayout from 'react-grid-layout';

import React, { Component } from 'react';

import { minimizeBytes } from '../util';

import './MirrorGrid.css';

class MirrorGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTen: null,
            topTenDate: null,
            days: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            topTen: nextProps.topTen,
            topTenDate: nextProps.topTenDate,
            days: nextProps.days
        })
    }

    render() {
        const layout = [
            {i: 'topten', x: 0, y: 0, w: 12, h: 1},
            {i: 'today_tx', x: 0, y: 1, w: 4, h: 1},
            {i: 'today_rx', x: 4, y: 1, w: 4, h: 1},
            {i: 'today_rate', x: 8, y: 1, w: 4, h: 1}
        ]

        const GridItemStyle = {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
            borderRadius: '3px',
        };

        let rateDiff, txDiff, rxDiff;

        if(this.state.days) {
            txDiff = (((this.state.days[0].tx - this.state.days[1].tx) / this.state.days[0].tx)*100).toFixed(2);
            rxDiff = (((this.state.days[0].rx - this.state.days[1].rx) / this.state.days[0].rx)*100).toFixed(2);
            rateDiff = (((this.state.days[0].rate - this.state.days[1].rate) / this.state.days[0].rate)*100).toFixed(2);
        }

        return (
            <ReactGridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={150}
                margin={[30, 30]}
                width={960}
                isResizable={false}
                isDraggable={false}>
                <div style={GridItemStyle} key="topten">
                    <h3>Yesterday's Top Ten Repos for {this.state.topTenDate}</h3>
                    <ol className="topTen">
                        {this.state.topTen && this.state.topTen.map(distro => {
                            return (
                                <li>
                                    {distro.distro}
                                    <span>
                                        {distro.GB}GB
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </div>
                <div style={GridItemStyle} key="today_tx" id="today_tx">
                    <h3>Today's Transfer</h3>
                    {this.state.days && <div className="today_value">{minimizeBytes(this.state.days[0].tx)}</div>}<br/>
                    {this.state.days && txDiff >= 0.0 ?
                        <span style={{color: 'green'}}>&#9650;{txDiff}% up</span> :
                        <span style={{color: 'red'}}>&#9660;{txDiff*-1}% down</span>
                    }
                </div>
                <div style={GridItemStyle} key="today_rx" id="today_rx">
                    <h3>Today's Recieved</h3>
                    {this.state.days && <div className="today_value">{minimizeBytes(this.state.days[0].rx)}</div>}<br/>
                    {this.state.days && rxDiff >= 0.0 ?
                        <span style={{color: 'green'}}>&#9650;{rxDiff}% up</span> :
                        <span style={{color: 'red'}}>&#9660;{rxDiff*-1}% down</span>
                    }
                </div>
                <div style={GridItemStyle} key="today_rate" id="today_rate">
                    <h3>Today's Rate</h3>
                    {this.state.days && <div className="today_value">{this.state.days[0].rate.toFixed(2)}Mbit/s</div>}<br/>
                    {this.state.days && rateDiff >= 0.0 ?
                        <span style={{color: 'green'}}>&#9650;{rateDiff}% up</span> :
                        <span style={{color: 'red'}}>&#9660;{rateDiff*-1}% down</span>
                    }
                </div>
            </ReactGridLayout>
        )
    }
}

export default MirrorGrid;