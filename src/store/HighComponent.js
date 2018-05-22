import React, { Component } from 'react';


class HighComponent extends Component {

    componentDidMount() {
        this.loop()
        setInterval(this.loop, this.props.interval)
    }
    loop = () => {

    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

HighComponent.defaultProps = {
    interval: 10000,
}

export default HighComponent;
