import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        border: '1px solid black',
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
        const className = letter ? css([styles.container, styles.filled]) : css(styles.container)
        return (
            <div className={className} >
                {letter && <span className={css(styles.mainText)}>{letter.letter}</span>}
                <span className={css(styles.subText)}>{pos.x + "," + pos.y}</span>
            </div>
        );
    }
}




