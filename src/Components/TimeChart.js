import React, { Component } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack, VictoryTooltip } from 'victory';

class TimeChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.txs);
        console.log(this.props.rxs);

        return (
            <VictoryChart
            width={700}
            domainPadding={40}>
                <VictoryAxis
                    tickValues={this.props.rxs.map(item => item['Time'])}
                    tickFormat={(x) => this.props.hour ? x.toString().split(':')[0] % 2 === 0 ? x : ' ' : x}
                    style={{
                        tickLabels: {fontSize: 10}
                    }}/>
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (this.props.hour ? `${x / 1000000000} GB` : `${x / 1000000000000} TB`)}
                    style={{
                        grid: {stroke: 'slategrey'},
                        tickLabels: {fontSize: 10}
                    }}/>
                <VictoryStack colorScale={["#6f7e5f", "#606060"]}>
                    <VictoryBar data={this.props.rxs} x="Time" y="Recieved Bandwidth"/>
                    <VictoryBar labelComponent={
                        <VictoryTooltip/>
                        }
                        data={this.props.txs} x="Time" y="Transferred Bandwidth"/>
                </VictoryStack>
            </VictoryChart>
        );
    }
}

export default TimeChart;