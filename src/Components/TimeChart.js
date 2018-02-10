import React, { Component } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryTooltip,
  VictoryLegend
} from "victory";

class TimeChart extends Component {
  render() {
    return (
      <VictoryChart width={1100} domainPadding={40}>
        <VictoryLegend
          orientation="horizontal"
          data={[
            { name: "Transfer", symbol: { fill: "#606060" } },
            { name: "Receive", symbol: { fill: "#94CD27" } }
          ]}
        />
        <VictoryAxis
          tickValues={this.props.rxs.map(item => item["Time"])}
          tickFormat={x =>
            this.props.hour
              ? x.toString().split(":")[0] % 2 === 0 ? x : " "
              : x
          }
          style={{
            tickLabels: { fontSize: 10 }
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={x =>
            this.props.hour ? `${x / 1e9} GB` : `${x / 1e12} TB`
          }
          style={{
            grid: { stroke: "slategrey" },
            tickLabels: { fontSize: 10 }
          }}
        />
        <VictoryStack
          colorScale={["#94CD27", "#606060"]}
          animate={{ onLoad: { duration: 250 } }}
        >
          <VictoryBar data={this.props.rxs} x="Time" y="Recieved Bandwidth" />
          <VictoryBar
            labelComponent={
              <VictoryTooltip
                pointerLength={5}
                flyoutStyle={{
                  fill: "white",
                  stroke: "slategrey",
                  filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))"
                }}
              />
            }
            data={this.props.txs}
            x="Time"
            y="Transferred Bandwidth"
          />
        </VictoryStack>
      </VictoryChart>
    );
  }
}

export default TimeChart;
