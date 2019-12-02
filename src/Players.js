import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import './styles.css';

function getPlayers() {
    // TODO api call to get Players

    // API returns JSON string like this:
    const playersJSON = '[{"id":"PashaBiceps","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Ninjas in Pyjamas"]},' +
                        '{"id":"ZywOo","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Ninjas in Pyjamas"]},' +
                        '{"id":"s1mple","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Ninjas in Pyjamas"]},' +
                        '{"id":"XANTARES","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Ninjas in Pyjamas"]},' +
                        '{"id":"Kaze","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Ninjas in Pyjamas"]},' +
                        '{"id":"coldzera","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Furia Esports"]},' +
                        '{"id":"BnTeT","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Furia Esports"]},' +
                        '{"id":"Sico","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Furia Esports"]},' +
                        '{"id":"KSCERATO","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Furia Esports"]},' +
                        '{"id":"device","fullName":"Jarosław Jarząbkowski","mail":"jaroslav.jarzabkowski@gmail.com","createdAt":"07-11-2017 20:22","countryCode":"PL","born":"11-04-1988","sex":"M","refereeRat":8,"actualPRank":1,"highestPRank":1,"teams":["Furia Esports"]}]';

    return JSON.parse(playersJSON);
}

class Delete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            email: props.player.email,
            nick: props.player.nick,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.delete = this.delete.bind(this);
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

    delete() {
        const appOnValueChanged = this.props.appOnValueChanged;
        const { email, nick } = this.state;
        const data = { email, nick, active: 0 };
        const call = {
            action: "editPlayer",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
                const response = JSON.parse(this.responseText);

                if (response.result) {
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const users = JSON.parse(this.responseText);
                            appOnValueChanged("users", users);
                        }
                    }
                    request.open("POST", "http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getPlayer","arguments":{"active":1}}');
                }
            }
        }
        request.open("POST", "http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        console.log(callStr);
        request.send(callStr);
    }

    render() {
        const id = this.props.id + "-delete-player";

        return (
            <>
                <Button onClick={this.open} variant="contained" color="secondary">Delete</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-dialog"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-dialog-title"}>Delete User</DialogTitle>
                    <DialogContent>
                        Do you really wish to delete this player?
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-delete"} onClick={this.delete} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            email: props.player.email,
            nick: props.player.nick,
            name: props.player.name,
            surname: props.player.surname,
            password: "",
            gender: props.player.gender,
            birthDate: props.player.birthDate,
            country: props.player.country,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.edit = this.edit.bind(this);
    }

    onValueChanged(key, value) {
        if (key === "country" && value.length > 2)
            value = value.substring(0, 2);

        this.setState({ [key]: value });
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    edit() {
        const appOnValueChanged = this.props.appOnValueChanged;
        const { email, nick, name, surname, password, gender, birthDate, country } = this.state;
        const data = { email, nick, name, surname, gender, birthDate, country };
        if (password.length > 0)
            data.password = password;
        const call = {
            action: "editPlayer",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
                const response = JSON.parse(this.responseText);

                if (response.result) {
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const users = JSON.parse(this.responseText);
                            appOnValueChanged("users", users);
                        }
                    }
                    request.open("POST", "http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getPlayer","arguments":{"active":1}}');
                }
            }
        }
        request.open("POST", "http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        console.log(callStr);
        request.send(callStr);
    }

    render() {
        const id = this.props.id + "=registration";

        return (
            <>
                <Button onClick={this.open} variant="contained">Edit</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-dialog"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-dialog-title"}>Edit User</DialogTitle>
                    <DialogContent>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-email"}
                                label="Email"
                                value={this.state.email}
                                onChange={e => this.onValueChanged("email", e.target.value)}
                                autoFocus
                                margin="dense"
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-nick"}
                                label="Nick"
                                value={this.state.nick}
                                onChange={e => this.onValueChanged("nick", e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-name"}
                                label="Name"
                                value={this.state.name}
                                onChange={e => this.onValueChanged("name", e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-surname"}
                                label="Surname"
                                value={this.state.surname}
                                onChange={e => this.onValueChanged("surname", e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-password"}
                                label="New Password"
                                value={this.state.password}
                                onChange={e => this.onValueChanged("password", e.target.value)}
                                type="password"
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-gender"}
                                select
                                label="Gender"
                                value={this.state.gender}
                                onChange={e => this.onValueChanged("gender", e.target.value)}
                                fullWidth
                            >
                                <MenuItem key={"F"} value={"F"}>
                                  {"Female"}
                                </MenuItem>
                                <MenuItem key={"M"} value={"M"}>
                                  {"Male"}
                                </MenuItem>
                            </TextField>
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-birthDate"}
                                label="Date of birth"
                                type="date"
                                value={this.state.birthDate}
                                onChange={e => this.onValueChanged("birthDate", e.target.value)}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-country"}
                                label="Country code"
                                value={this.state.country}
                                onChange={e => this.onValueChanged("country", e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-edit"} onClick={this.edit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default class Players extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: getPlayers()
        };

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    render() {
        const id = "edit-user";

        const PlayerPanel = (player) => {
            const teams = player.teams;
            let teamsStr;
            if (teams)
                teamsStr = teams.join(", ");

            return (
                <ExpansionPanel key={player.nick}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                      { player.nick }
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                      <table id="my-table">
                        <tbody>
                            <tr>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                            <tr>
                              <td><b>Name:</b> { player.name }</td>
                              <td><b>Surname:</b> { player.surname }</td>
                              <td><b>Team(s):</b> { teamsStr } </td>
                            </tr>
                            <tr>
                              <td><b>Country:</b> { player.country }</td>
                              <td><b>Born:</b> { player.birthDate }</td>
                              <td><b>Sex:</b> { player.gender === "M"
                                                ? "Male" : "Female" }</td>
                            </tr>
                            <tr>
                              <td><b>Referee rating:</b> { player.refereeRat }</td>
                              <td><b>Current player rank:</b> { player.actualPRank }</td>
                              <td><b>Highest player rank:</b> { player.highestPRank }</td>
                            </tr>
                        </tbody>
                      </table>
                  </ExpansionPanelDetails>
                  <ExpansionPanelActions>
                      <Edit id={id} player={player} appOnValueChanged={this.props.appOnValueChanged} />
                      <Delete id={id} player={player} appOnValueChanged={this.props.appOnValueChanged} />
                  </ExpansionPanelActions>
                </ExpansionPanel>
            );
        };

        // const body = this.state.players.map(player => PlayerPanel(player));
        const body = this.props.users.map(player => PlayerPanel(player));

        return(
            <>
                { body }
            </>
        );
    };
}
