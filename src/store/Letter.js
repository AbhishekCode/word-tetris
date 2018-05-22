import React, { Component } from 'react';
import { noOfColumn, numberOfRow } from '../containers/gamestate';


class LetterComponent extends Component {
    state = {
        letter: []
    }
    componentDidMount() {
        this.loop()
        setInterval(this.loop, this.props.interval)
    }

    loop = () => {
        const allletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const letter = allletters.charAt(Math.floor(Math.random() * allletters.length));
        const columnno = Math.floor(Math.random() * noOfColumn) + 1
        const newLetter = { letter: letter, pos: { x: columnno, y: numberOfRow } }
        this.setState({ letter: { ...this.state.letter, newLetter } })
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

LetterComponent.defaultProps = {
    interval: 10000,
}

export default LetterComponent;
