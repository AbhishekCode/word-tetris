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
    },
    controlContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    },
    buttons: {
        width: 100,
        height: 40,
        margin: 10
    }
});

const GAMESTATE = {
    INITIAL: 'initial',
    IN_PROGRESS: "inProgress",
    PAUSED: 'paused',
    ENDED: 'ended',
}

class Game extends Component {
    letters = [];
    wordQueue = [];
    gameState = GAMESTATE.INITIAL;
    state = {
        updateFlag: false,
        score: 0
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
        this.gameState = GAMESTATE.IN_PROGRESS;
        if (this.letters.length == 0) {
            this.generateLetter();
        }
        setTimeout(this.startMoving, moveTime);
    }

    _pauseGame = () => {
        this.gameState = GAMESTATE.PAUSED;
        clearInterval(this.gameInterval)
        this.setState({ updateFlag: !this.state.updateFlag })
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
            //this._checkPossibleWords();
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
            columns.push(<BlockColumn columnId={i} letters={letter} onLetterClick={this._onLetterClick} />)
        }

        return columns;
    }

    _onLetterClick = (letter) => {

        this.letters.find(_l => {
            if (_l.pos.x == letter.pos.x && _l.pos.y == letter.pos.y) {
                _l.isWord = true;
            }
        })
        this.wordQueue.push(letter);
        this.setState({ updateFlag: !this.state.updateFlag })

    }

    _checkWordAndDestroy = () => {
        if (this.wordQueue.length > 0) {

            //check its proper selected // in sequence
            // row check 
            let wordIsInRow = true;
            let wordIsInColumn = true;
            if (this.wordQueue.length > 1) {
                for (let i = 0; i < this.wordQueue.length - 1; i++) {
                    if (Math.abs(this.wordQueue[i].pos.x - this.wordQueue[i + 1].pos.x) != 1) {
                        wordIsInRow = false;
                    }
                }
            }

            if (!wordIsInRow) {
                // if not in row then only we will check for column
                for (let i = 0; i < this.wordQueue.length - 1; i++) {
                    if (Math.abs(this.wordQueue[i].pos.y - this.wordQueue[i + 1].pos.y) != 1) {
                        wordIsInColumn = false;
                    }
                }
            }

            if (wordIsInRow || wordIsInColumn) {
                let word = "";
                this.wordQueue.forEach(_w => word = word + _w.letter);
                if (checkWord(word.toLowerCase())) {
                    // valid word
                    this.letters = this.letters.filter(_letter => {
                        const _letterInWordQueue = this.wordQueue.find(_wl => (_wl.pos.x == _letter.pos.x && _wl.pos.y == _letter.pos.y))
                        if (_letterInWordQueue) return false;
                        return true
                    })
                    const newScore = this.state.score + word.length * 10;

                    //fill empty space left by destroyed letters
                    if (wordIsInRow) {
                        this.wordQueue.forEach(_wq => {
                            this.letters.forEach(_l => {
                                if (_l.pos.x == _wq.pos.x && _l.pos.y < _wq.pos.y) {
                                    _l.pos.y = _l.pos.y + 1;
                                }
                            })
                        })
                    } else if (wordIsInColumn) {
                        this.letters.forEach(_l => {
                            if (_l.pos.x == this.wordQueue[0].pos.x && _l.pos.y < this.wordQueue[0].pos.y) {
                                _l.pos.y = _l.pos.y + this.wordQueue.length
                            }
                        })
                    }


                    this.setState({ updateFlag: !this.state.updateFlag, score: newScore })
                }
            }
            this.wordQueue = [];
            this.letters.forEach(_l => _l.isWord = false);
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }

    render() {
        console.log("this.letters", this.letters)
        return (
            <div className={css(styles.container)} >
                {this._getColumn()}
                <div className={css(styles.controlContainer)}>
                    <div> {`Score : ${this.state.score}`} </div>
                    {this.gameState != GAMESTATE.IN_PROGRESS &&
                        <button className={css(styles.buttons)} onClick={this._startGame}> {this.letters.length > 0 ? "Resume" : "Start"}</button>}
                    {this.gameState != GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS && <button className={css(styles.buttons)} onClick={this._pauseGame}> Pause</button>}
                    {this.wordQueue.length > 0 && <button className={css(styles.buttons)} onClick={this._checkWordAndDestroy}> Destroy Word</button>}
                </div>
            </div>
        );
    }
}


export default Game


