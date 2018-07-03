

import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Button from '@material-ui/core/Button';

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

export default class About extends Component {

    render() {

        return (
            <div className={css(styles.container)}>
                <h3>{`Score : ${this.props.score}`}</h3>
                <h3>{`High Score: ${getHighScore()}`}</h3>

                <h4>How To play?</h4>
                <div>Make words using letters</div>
                <div>Select letters by clicking and then click destroy button(leave it for 2 second it wil happen automatically), if it is a valid word then it will disappear</div>
                <Button href="https://www.youtube.com/watch?v=qvoL5J-jsFA&feature=youtu.be">
                    Here is game play video.
                </Button>
                <h4>Check out github repo here</h4>
                <a className="github-button" href="https://github.com/abhishekcode/word-tetris" data-size="large" data-show-count="true" aria-label="Star abhishekcode/word-tetris on GitHub">Github Repo</a>
            </div>
        );
    }
}




