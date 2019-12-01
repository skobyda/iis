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
            loggedUser: undefined,
            users: [],
        };

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    componentDidMount() {
        const onValueChanged = this.onValueChanged;
        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const users = JSON.parse(this.responseText);
                onValueChanged("users", users);
            }
        }
        request.open("POST", "http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send('{"action":"getPlayer","arguments":{"active":1}}');
    }

    render() {
        const { loggedUser, page } = this.state;

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
                    <UserPanel appOnValueChanged={this.onValueChanged} loggedUser={loggedUser} />
                </div>
                <header className="App-page">
                    <div className="App-content">
                        { page === menu.TOURNAMENTS && <Tournaments /> }
                        { page === menu.TEAMS && <Teams /> }
                        { page === menu.PLAYERS && <Players users={this.state.users} /> }
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
