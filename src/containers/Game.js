import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BlockColumn from './Column'

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: 40
    }
});

const noOfColumn = 10;

class Game extends Component {
    _getColumn = () => {
        let columns = []
        for (let i = 0; i < noOfColumn; i++) {
            columns.push(<BlockColumn />)
        }

        return columns;
    }
    render() {
        return (
            <div className={css(styles.container)} >
                {this._getColumn()}
            </div>
        );
    }
}

export default Game;


