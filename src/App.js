import React from 'react';
import './App.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import UserPanel from './userPanel.js';
import Tournaments from './Tournaments.js';
import Teams from './Teams.js';
import Players from './Players.js';

const menu = { // index of menu items
    TOURNAMENTS: 0,
    TEAMS: 1,
    PLAYERS: 2,
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
        };

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    render() {
        const { page } = this.state;

        return (
            <div className="App">
                <div>
                    <AppBar position="static">
                        <Tabs aria-label="menu"
                            onChange={(event, value) => this.onValueChanged("page", value)}
                            value={page}
                        >
                            <Tab label="Tournaments" />
                            <Tab label="Teams" />
                            <Tab label="Players" />
                        </Tabs>
                    </AppBar>
                    <UserPanel />
                </div>
                <header className="App-page">
                    <div className="App-content">
                        { page === menu.TOURNAMENTS && <Tournaments /> }
                        { page === menu.TEAMS && <Teams /> }
                        { page === menu.PLAYERS && <Players /> }
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
