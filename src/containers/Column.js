import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import Block from './Block'

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const numberOfBlocks = 15;

export default class BlockColumn extends Component {

    _getBlocks = () => {
        let blocks = []
        for (let i = 0; i < numberOfBlocks; i++) {
            blocks.push(<Block />)
        }

        return blocks;
    }

    render() {
        return (
            <div className={css(styles.container)} >
                {this._getBlocks()}
            </div>
        );
    }
}




