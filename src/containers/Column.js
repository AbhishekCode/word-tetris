import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import Block from './Block'
import { numberOfRow } from '../config/config'

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column'
    }
});


export default class BlockColumn extends Component {


    getLetterOnBlock = (bId) => {
        const { letters } = this.props;
        if (letters) {
            for (let i = 0; i < letters.length; i++) {
                if (letters[i].pos.y == bId) {
                    return letters[i]
                }
            }
        }

        return undefined;

    }

    _getBlocks = () => {
        let blocks = []
        for (let i = 0; i < numberOfRow; i++) {
            const _letterOnBlock = this.getLetterOnBlock(i)
            blocks.push(
                <Block
                    onLetterClick={this.props.onLetterClick}
                    pos={{ x: this.props.columnId, y: i }}
                    letter={_letterOnBlock} />
            );
        }
        return blocks;
    }

    render() {
        return (
            <div className={css(styles.container)} >
                {this._getBlocks()}
            </div>
        );
    }
}




