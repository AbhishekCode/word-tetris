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
        window.addEventListener("keypress", this._onKeyPress);
    }

    _onKeyPress = (evt) => {
        if (evt.key === "a") {
            //move left
            this._moveLeft()
        } else if (evt.key === "d") {
            //move right
            this._moveRight()
        }
    }

    _moveLeft = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                if (this.letters[i].pos.x > 0) {
                    this.letters[i].pos.x = this.letters[i].pos.x - 1;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }

    _moveRight = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                if (this.letters[i].pos.x < noOfColumn - 1) {
                    this.letters[i].pos.x = this.letters[i].pos.x + 1;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
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

    _alreadyHasLetterInPos = (pos) => {
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x == pos.x && this.letters[i].pos.y == pos.y) {
                return true;
            }
        }
        return false;
    }

    moveLetters = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.y < numberOfRow - 1 && this.letters[i].moving) {
                const alreadyHas = this._alreadyHasLetterInPos({ x: this.letters[i].pos.x, y: this.letters[i].pos.y + 1 })
                if (!alreadyHas)
                    this.letters[i].pos.y = this.letters[i].pos.y + 1;
                if (this.letters[i].pos.y == numberOfRow - 1 || alreadyHas) {
                    this.letters[i].moving = false;
                }
                updatedSomething = true;
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
            moving: true,
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


