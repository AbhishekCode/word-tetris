import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        border: '1px solid black',
        textAlign: 'center',
        height: 50,
        width: 50
    }
});


export default class Block extends Component {

    render() {
        return (
            <div className={css(styles.container)} >
            </div>
        );
    }
}




