import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Button from '@material-ui/core/Button';

import { COLORS, blockSize } from '../config/config';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        borderRadius: 0,
        minWidth: 10,
        minHeight: 10,
        height: blockSize(),
        width: blockSize(),
    },
    buttonContent: {
        display: 'flex',
        flex: 1,
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainText: {
        fontFamily: "'Roboto', sans-serif",
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 600
    },
    subText: {
        fontSize: 10
    }
});


export default class Block extends Component {


    _onBlockClick = () => {
        const { letter, onLetterClick } = this.props;
        if (letter && onLetterClick) {
            onLetterClick(letter);
        }
    }

    render() {
        const { letter, pos } = this.props;

        let fillerStyle = { border: '1px solid black' }
        if (letter) {
            let _backgroundColor = letter.moving ? COLORS.MOVING : COLORS.NOTMOVING;
            if (letter.isWord) _backgroundColor = COLORS.POSSIBLE_WORD;
            fillerStyle = {
                backgroundColor: _backgroundColor,
                border: '1px solid white'
            }
        }
        return (
            <Button variant="outlined" className={css(styles.container)} style={fillerStyle} onClick={this._onBlockClick}>
                <div className={css(styles.buttonContent)}>
                    {letter && <span className={css(styles.mainText)}>{letter.letter}</span>}
                    {process.env.NODE_ENV !== 'production' && <span className={css(styles.subText)} > {pos.x + "," + pos.y}</span >}
                </div>
            </Button >
        );
    }
}




