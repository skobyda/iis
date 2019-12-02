import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import './styles.css';

const TeamBody = ({ id, state, onValueChanged }) => {
    return (<>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-name"}
                label="Name"
                value={state.name}
                onChange={e => onValueChanged("name", e.target.value)}
                fullWidth
                />
        </Box>
        <Box m={1} component="span" display="block">
        </Box>
    </>);
}

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            name: "",
            players: ["Afghanistan"],
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.create = this.create.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    create() {
        const close = this.close;
        const appOnValueChanged = this.props.appOnValueChanged;
        const onValueChanged = this.onValueChanged;
        const { name} = this.state;
        const data = { email: this.props.loggedUser.email, name };
        const call = {
            action: "createTeam",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error") {
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const teams = JSON.parse(this.responseText);
                            appOnValueChanged("teams", teams);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTeam","arguments":{"active":1}}');
                    close();
                } else {
                    onValueChanged("errorMessage", response.message);
                }
            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send(callStr);
    }

    render() {
        const id = "create";
        return (
            <>
                <Button onClick={this.open} variant="contained" color="primary">Create Team</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Create Team</DialogTitle>
                    <DialogContent>
                        <TeamBody id={id}
                            state={this.state}
                            onValueChanged={this.onValueChanged} />
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-create"} onClick={this.create} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class EditTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            name: props.team.name,
            players: props.team.players,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.save = this.save.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    save() {
        const close = this.close;
        const appOnValueChanged = this.props.appOnValueChanged;
        const onValueChanged = this.onValueChanged;
        const { name} = this.state;
        if (name !== this.props.team.name) {
            const data = { name: this.props.team.name, newName: name };
            const call = {
                action: "editTeam",
                arguments: data
            };
            const callStr = JSON.stringify(call);

            const request= new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    const response = JSON.parse(this.responseText);

                    if (response.result && response.result !== "Error") {
                        const request= new XMLHttpRequest();
                        request.onreadystatechange = function() {
                            if (this.readyState === 4 && this.status === 200) {
                                const teams = JSON.parse(this.responseText);
                                appOnValueChanged("teams", teams);
                            }
                        }
                        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                        request.send('{"action":"getTeam","arguments":{"active":1}}');
                        close();
                    } else {
                        onValueChanged("errorMessage", response.message);
                    }
                }
            }
            request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
            request.send(callStr);
        }
        this.close();
    }

    render() {
        const id = this.props.team.id + "-edit";
        return (
            <>
                <Button onClick={this.open} variant="contained">Edit</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Edit Team Details</DialogTitle>
                    <DialogContent>
                        <TeamBody id={id}
                            state={this.state}
                            onValueChanged={this.onValueChanged} />
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-save"} onClick={this.save} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class LeaveTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.join = this.join.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    join() {
        const close = this.close;
        const appOnValueChanged = this.props.appOnValueChanged;
        const onValueChanged = this.onValueChanged;
        const data = { email: this.props.loggedUser.email, team: this.props.team.name };
        const call = {
            action: "leaveTeam",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error") {
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const teams = JSON.parse(this.responseText);
                            appOnValueChanged("teams", teams);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTeam","arguments":{"active":1}}');
                    close();
                } else {
                    onValueChanged("errorMessage", response.message);
                }
            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send(callStr);
    }

    render() {
        const id = this.props.team.id + "-join";
        return (
            <>
                <Button onClick={this.open} variant="contained" color="secondary">Leave</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Leave Team</DialogTitle>
                    <DialogContent>
                        Leave this team?
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-join"} onClick={this.join} color="secondary">
                            Leave
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class JoinTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.join = this.join.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    join() {
        const close = this.close;
        const appOnValueChanged = this.props.appOnValueChanged;
        const onValueChanged = this.onValueChanged;
        const data = { email: this.props.loggedUser.email, team: this.props.team.name };
        const call = {
            action: "joinTeam",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error") {
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const teams = JSON.parse(this.responseText);
                            appOnValueChanged("teams", teams);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTeam","arguments":{"active":1}}');
                    close();
                } else {
                    onValueChanged("errorMessage", response.message);
                }
            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send(callStr);
    }

    render() {
        const id = this.props.team.id + "-join";
        return (
            <>
                <Button onClick={this.open} variant="contained">Join</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Request Team Membership</DialogTitle>
                    <DialogContent>
                        Join this team?
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-join"} onClick={this.join} color="secondary">
                           Join 
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    render() {
        const TeamPanel = (team) => {
            const players = team.players.map(p => p.nick ? p.nick : p.emal);
            const playersStr = players.join(", ");

            return (
                <ExpansionPanel key={ team.name }>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                      { team.name }
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                      <table id="my-table">
                        <tbody>
                            <tr>
                              <th></th>
                            </tr>
                            <tr>
                              <td><b>Players:</b> { playersStr }</td>
                              <td><b>Founded:</b> { team.founded }</td>
                            </tr>
                        </tbody>
                      </table>
                  </ExpansionPanelDetails>
                  {this.props.loggedUser &&
                  <ExpansionPanelActions>
                      {!players.includes(this.props.loggedUser.nick) &&
                      <JoinTeam team={team} loggedUser={this.props.loggedUser} appOnValueChanged={this.props.appOnValueChanged}/>}
                      {players.includes(this.props.loggedUser.nick) &&
                      <LeaveTeam team={team} loggedUser={this.props.loggedUser} appOnValueChanged={this.props.appOnValueChanged}/>}
                      {((this.props.loggedUser.email === team.founder) || (this.props.loggedUser.nick === "admin")) && <>
                          <EditTeam team={team} appOnValueChanged={this.props.appOnValueChanged}/>
                      </>}
                  </ExpansionPanelActions>}
                </ExpansionPanel>
            );
        };

        const body = this.props.teams.map(team => TeamPanel(team));

        return (
            <Grid container spacing={3}>
                {this.props.loggedUser &&
                <Grid item xs={12}>
                    <Box display="flex" css={{ float: "right" }}>
                        <CreateTeam loggedUser={this.props.loggedUser} appOnValueChanged={this.props.appOnValueChanged} />
                    </Box>
                </Grid>}
                <Grid item xs={12}>
                    { body }
                </Grid>
            </Grid>
        );
    };
}
