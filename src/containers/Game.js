import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import Button from '@material-ui/core/Button';
import LeftIcon from '@material-ui/icons/ArrowBack';
import RightIcon from '@material-ui/icons/ArrowForward';
import DownIcon from '@material-ui/icons/ArrowDownward';


import BlockColumn from './Column'
import { noOfColumn, numberOfRow, moveTime, windowWidth, checkWordTime } from '../config/config'
import { checkWord } from '../config/wordCheck';
import { saveHighScore, getHighScore, scoreForThisWord } from '../config/SaveScore';
import { lettersAdjustedPerWeight } from '../config/GenerateLetter';
import GameOver from './GameOver';
import About from './About';



const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    scoreLine: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3367D6',
        color: '#fff',
        fontFamily: "'Roboto', sans-serif",
        fontSize: "1.0rem",
        fontWeight: 600,
        '@media (max-width: 700px)': {
            width: windowWidth()
        }
    },
    gameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    score: {
        margin: 5,
        paddin: 5
    },
    controlContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // flexWrap: 'wrap',
        padding: 0
    },
    buttons: {
        // border: '1px solid blue',
        width: 80,
        height: 40,
        margin: 5
    }
});

const GAMESTATE = {
    INITIAL: 'initial',
    IN_PROGRESS: "inProgress",
    PAUSED: 'paused',
    ENDED: 'ended',
}

const allletters = lettersAdjustedPerWeight();

class Game extends Component {
    letters = [];
    wordQueue = [];
    gameState = GAMESTATE.INITIAL;
    checkWordAutomatic;
    state = {
        updateFlag: false,
        score: 0
    }

    componentDidMount() {
        window.addEventListener("keydown", this._onKeyPress);
    }

    _onKeyPress = (evt) => {
        evt.preventDefault();
        if (evt.key === "a" || evt.keyCode === 37) {
            //move left
            this._moveLeft()
        } else if (evt.key === "d" || evt.keyCode === 39) {
            //move right
            this._moveRight()
        } else if (evt.key === "s" || evt.keyCode === 40) {
            //move right
            this._moveDown()
        }
    }

    _moveLeft = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                if (this.letters[i].pos.x > 0 && !this._alreadyHasLetterInPos({ x: this.letters[i].pos.x - 1, y: this.letters[i].pos.y })) {
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
                if (this.letters[i].pos.x < noOfColumn - 1 && !this._alreadyHasLetterInPos({ x: this.letters[i].pos.x + 1, y: this.letters[i].pos.y })) {
                    this.letters[i].pos.x = this.letters[i].pos.x + 1;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }

    _moveDown = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                const alreadyHas = this._alreadyHasLetterInPos({ x: this.letters[i].pos.x, y: this.letters[i].pos.y + 1 });
                if (this.letters[i].pos.y < numberOfRow - 1 && !alreadyHas) {
                    this.letters[i].pos.y = this.letters[i].pos.y + 1;
                }

                if (this.letters[i].pos.y == numberOfRow - 1 || alreadyHas) {
                    this.letters[i].moving = false;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }


    _startGame = () => {
        if (this.gameState != GAMESTATE.PAUSED)
            this.setState({ score: 0 })
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
        clearInterval(this.gameInterval)
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
                if (this.letters[i].pos.y == 0) {
                    // so basically one column is full Game over
                    saveHighScore(this.state.score)
                    this.letters = [];
                    clearInterval(this.gameInterval)
                    this.gameState = GAMESTATE.ENDED;
                    this.setState({ updateFlag: !this.state.updateFlag })
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
        const letter = allletters[Math.floor(Math.random() * allletters.length)];
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
            columns.push(<BlockColumn key={`column${i}`} columnId={i} letters={letter} onLetterClick={this._onLetterClick} />)
        }

        return columns;
    }

    _onLetterClick = (letter) => {

        this.letters.find(_l => {
            if (_l && _l.pos.x == letter.pos.x && _l.pos.y == letter.pos.y) {
                _l.isWord = !_l.isWord;

                if (_l.isWord)
                    this.wordQueue.push(letter);
                else {
                    //remove from wordQueue
                    this.wordQueue.splice(this.wordQueue.findIndex(_l => _l && _l.pos.x == letter.pos.x && _l.pos.y == letter.pos.y), 1);
                }
            }
        })

        this.setState({ updateFlag: !this.state.updateFlag })


        //check word automatically 
        clearTimeout(this.checkWordAutomatic)
        this.checkWordAutomatic = setTimeout(this._checkWordAndDestroy, checkWordTime)

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
                    const newScore = this.state.score + scoreForThisWord(word.length);

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
        return (
            <div className={css(styles.container)} >
                <div className={css(styles.scoreLine)}>
                    <div className={css(styles.score)}> {`High Score : ${getHighScore()}`} </div>
                    <div className={css(styles.score)}> {`Score : ${this.state.score}`} </div>
                </div>
                {this.gameState != GAMESTATE.ENDED &&
                    <div className={css(styles.gameContainer)}>
                        {this._getColumn()}
                    </div>
                }
                {this.gameState === GAMESTATE.ENDED &&
                    <GameOver score={this.state.score} />
                }
                <div className={css(styles.controlContainer)}>
                    {this.gameState != GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" className={css(styles.buttons)} onClick={this._startGame}> {this.letters.length > 0 ? "Resume" : "Start"}</Button>}
                    {this.gameState != GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" className={css(styles.buttons)} onClick={this._pauseGame}> Pause</Button>}
                    {this.wordQueue.length > 0 &&
                        <Button variant="contained" size="small" className={css(styles.buttons)} onClick={this._checkWordAndDestroy}> Destroy</Button>}
                    {this.gameState != GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" className={css(styles.buttons)} onClick={this._moveLeft}><LeftIcon /></Button>}
                    {this.gameState != GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" className={css(styles.buttons)} onClick={this._moveRight}><RightIcon /></Button>}
                    {this.gameState != GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" className={css(styles.buttons)} onClick={this._moveDown}><DownIcon /></Button>}
                </div>
                <About score={this.state.score} />
            </div>
        );
    }
}


export default Game


