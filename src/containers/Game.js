import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BlockColumn from './Column'
import { noOfColumn, numberOfRow, moveTime } from '../config/config'

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: 40,
        paddingRight: 40
    }
});

class Game extends Component {
    letters = []
    state = {
        updateFlag: false
    }

    componentDidMount() {

    }

    _startGame = () => {
        this.generateLetter();
        setTimeout(this.startMoving, moveTime);
    }

    _endGame = () => {
        clearInterval(this.gameInterval)
    }

    startMoving = () => {
        this.gameInterval = setInterval(this.moveLetters, moveTime);
    }

    moveLetters = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.y < numberOfRow - 1) {
                console.log("  this.letters[i] ", this.letters[i].pos.y)
                this.letters[i].pos.y = this.letters[i].pos.y + 1;
                updatedSomething = true;
                console.log(" after this.letters[i] ", this.letters[i].pos.y)
            }
        }
        if (updatedSomething) {
            //console.log(this.state.letters, " vs ", updated)
            this.setState({ updateFlag: !this.state.updateFlag })
        } else {
            this.generateLetter();
        }
    }

    generateLetter = () => {
        const allletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const letter = allletters.charAt(Math.floor(Math.random() * allletters.length));
        const columnno = Math.floor(Math.random() * noOfColumn);


        const newLetter = {
            letter: letter,
            pos: {
                x: columnno,
                y: 0
            }
        }
        console.log("newLetter ", newLetter)
        this.letters = [...this.letters, newLetter]
        this.setState({ updateFlag: !this.state.updateFlag })
    }

    _getLetterForThisColumn = (column) => {
        const _letterInColumn = []
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x === column)
                _letterInColumn.push(this.letters[i])
        }
        return _letterInColumn
    }

    _getColumn = () => {
        console.log("should update column  ")
        let columns = []
        for (let i = 0; i < noOfColumn; i++) {
            const letter = this._getLetterForThisColumn(i)
            if (letter.length > 0) console.log("foudn in one ", letter)
            columns.push(<BlockColumn columnId={i} letters={letter} />)
        }

        return columns;
    }
    render() {
        console.log(this.letters)
        return (
            <div className={css(styles.container)} >
                {this._getColumn()}

                <div>
                    <button onClick={this._startGame}> start</button>
                    <button onClick={this._endGame}> pause</button>
                </div>
            </div>
        );
    }
}

export default Game


