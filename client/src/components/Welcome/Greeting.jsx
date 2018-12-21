import React from 'react';

export default class Greeting extends React.Component {

    constructor(props) {
        // 必须调用
        super(props);
        // 初始化组件的 state
        this.state = {
            date: new Date()
        };

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

    }
}

Greeting.defaultProps = {
    data: new DataCue(),
    name: "app1"
}