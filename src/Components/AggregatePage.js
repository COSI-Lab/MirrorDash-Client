import React, { Component } from 'react';

import Lokka from 'lokka';
import { Transport } from 'lokka-transport-http';

import SlideInDiv from './SlideInDiv';

import { minimizeBytes } from '../util';

const client = new Lokka({
    transport: new Transport('http://localhost:4000/graphql')
});

class AggregatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {total: 4};
        this.getData();
    }

    getData() {
        client.query(`
            {
                total {
                    total
                }
            }
        `).then((res) => {
            this.setState(prevState => {
                return { total: res.total.total };
            });
        });
    }

    render() {
        const aggStyle = {
            padding: 10,
            marginTop: 25,
            marginLeft: 26,
            backgroundColor: 'white',
            width: 500,
            fontSize: 20,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
            borderRadius: 5
        }

        return (
            <SlideInDiv>
                <h2 style={{marginLeft: 30, marginBottom: -20, color: '#4b4b4b', fontSize: '100%'}}>Aggregate Stats</h2>
                {this.state.total &&
                    <div style={aggStyle}>
                        Total: {minimizeBytes(this.state.total)}
                    </div>
                }
            </SlideInDiv>
        )
    }
}

export default AggregatePage;