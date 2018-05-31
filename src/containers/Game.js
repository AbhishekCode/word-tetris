import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BlockColumn from './Column'
import { noOfColumn, numberOfRow, moveTime } from '../config/config'
import { checkWord } from '../config/wordCheck';

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
            this._checkPossibleWords();
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
            isWord: false,
            pos: {
                x: columnno,
                y: 0
            }
        }
        this.letters = [...this.letters, newLetter]
        this.setState({ updateFlag: !this.state.updateFlag })
    }

    _getLetterAtPos = (pos) => {
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x == pos.x && this.letters[i].pos.y == pos.y) {
                return this.letters[i]
            }
        }

        return undefined;
    }

    _checkPossibleWords = () => {
        console.log("ww will check word in ", this.letters)

        this.letters.forEach((_letter, index) => {
            let possibleWord = _letter.letter;
            let letterEnvolved = [_letter]

            //check on y
            for (let i = _letter.pos.y - 1; i > 0; i--) {
                let posToCheck = { x: _letter.pos.x, y: i }
                let letterAtThisPos = this._getLetterAtPos(posToCheck)
                console.log("letterAtThisPos", posToCheck, "  ", letterAtThisPos);
                if (letterAtThisPos) {
                    possibleWord = possibleWord + letterAtThisPos.letter
                    letterEnvolved.push(letterAtThisPos)
                } else {
                    i = 0;
                }
            }
            console.log("checking word ", possibleWord, " ||| found ", checkWord(possibleWord.toLowerCase()))
            if (checkWord(possibleWord.toLowerCase())) letterEnvolved.forEach(_letter => _letter.isWord = true)

            // check on x

        })

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
        let columns = []
        for (let i = 0; i < noOfColumn; i++) {
            const letter = this._getLetterForThisColumn(i)
            columns.push(<BlockColumn columnId={i} letters={letter} />)
        }

        return columns;
    }
    render() {
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


