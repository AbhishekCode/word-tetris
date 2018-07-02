import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';


import { Twitter, Facebook, Whatsapp } from 'react-social-sharing'
import { getHighScore } from '../config/SaveScore';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const url = "https://www.indexzero.in/word-tetris/";

export default class GameOver extends Component {

    render() {

        return (
            <div className={css(styles.container)}>
                <h2>Game Over</h2>
                <h3>{`You scored ${this.props.score}`}</h3>
                <h3>{`Your Highest Score ${getHighScore()}`}</h3>

                <Twitter circle big message={`Yay, I scored ${this.props.score}!, Play tetris with words -:) #TetrisWithWord via @abvishek ${url}`} link={url} />
                <Facebook circle big link={url} />
                <Whatsapp solidcircle big message={`Yay, I scored ${this.props.score}!, Play tetris with words -:) #TetrisWithWord`} link={url} />
            </div>
        );
    }
}




