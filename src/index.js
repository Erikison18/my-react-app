import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Router from './router/router';
import { Menu } from 'antd';
import "./index.css";

class App extends React.Component {
    state = {
        current: 'gameChess',
    };

    handleClick = e => {
        // console.log('click ', e);
        this.setState({ current: e.key });
    };

    render() {
        const { current } = this.state;
        return (<Provider store={store}>
            <div>
                <Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[current]}>
                    <Menu.Item key="gameChess">
                        <a href="#/gameChess">gameChess</a>
                    </Menu.Item>
                    <Menu.Item key="coreContent">
                        <a href="#/coreContent">coreContent</a>
                    </Menu.Item>
                    <Menu.Item key="seniorGuidance">
                        <a href="#/seniorGuidance">seniorGuidance</a>
                    </Menu.Item>
                    <Menu.Item key="api">
                        <a href="#/api">Api</a>
                    </Menu.Item>
                    <Menu.Item key="hook">
                        <a href="#/hook">Hook</a>
                    </Menu.Item>
                    <Menu.Item key="faq">
                        <a href="#/faq">FAQ</a>
                    </Menu.Item>
                    <Menu.Item key="redux">
                        <a href="#/redux">Redux</a>
                    </Menu.Item>
                    <Menu.Item key="about">
                        <a href="#/about">About</a>
                    </Menu.Item>
                    <Menu.Item key="strategy">
                        <a href="#/strategy">Strategy</a>
                    </Menu.Item>
                    <Menu.Item key="sell">
                        <a href="#/sell">Sell</a>
                    </Menu.Item>
                    <Menu.Item key="sellFilter">
                        <a href="#/sellFilter">sellFilter</a>
                    </Menu.Item>
                    <Menu.Item key="tradeHistory">
                        <a href="#/tradeHistory">tradeHistory</a>
                    </Menu.Item>
                    <Menu.Item key="instruction">
                        <a href="#/instruction">instruction</a>
                    </Menu.Item>
                    <Menu.Item key="performance">
                        <a href="#/performance">performance</a>
                    </Menu.Item>
                    <Menu.Item key="rtquery">
                        <a href="#/rtquery">rtquery</a>
                    </Menu.Item>
                </Menu>
                <div className="page-content">
                    <Router />
                </div>
            </div>
        </Provider >)
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'))
