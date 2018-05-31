import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { COLORS } from '../config/config';


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50
    },
    filled: {
        backgroundColor: 'green',
        border: '1px solid white'
    },
    mainText: {
        fontSize: 20,
    },
    subText: {
        fontSize: 10
    }
});


export default class Block extends Component {

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
        const className = letter ? css([styles.container]) : css(styles.container)
        return (
            <div className={className} style={fillerStyle} >
                {letter && <span className={css(styles.mainText)}>{letter.letter}</span>}
                < span className={css(styles.subText)} > {pos.x + "," + pos.y}</span >
            </div >
        );
    }
}




