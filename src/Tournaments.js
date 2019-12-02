import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import './styles.css';

const TournamentBody = ({ id, state, onValueChanged }) => { 
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
            <TextField id={id + "-teamSize"}
                label="Players per team"
                value={state.teamSize}
                onChange={e => onValueChanged("teamSize", e.target.value)}
                type="number"
                fullWidth
            />
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-capacity"}
                label="Max number of teams"
                value={state.capacity}
                onChange={e => onValueChanged("capacity", e.target.value)}
                type="number"
                fullWidth
            />
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-prizes"}
                label="Prizes"
                value={state.prizes}
                onChange={e => onValueChanged("prizes", e.target.value)}
                fullWidth
            />
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-ageCategory"}
                select
                label="Age category"
                value={state.ageCategory}
                onChange={e => onValueChanged("ageCategory", e.target.value)}
                fullWidth
            >
                <MenuItem key={"Everyone"} value={"Everyone"}>
                  {"Everyone"}
                </MenuItem>
                <MenuItem key={"Juniors"} value={"Juniors"}>
                  {"Juniors"}
                </MenuItem>
                <MenuItem key={"Adults"} value={"Adults"}>
                  {"Adults"}
                </MenuItem>
                <MenuItem key={"Seniors"} value={"Seniors"}>
                  {"Seniors"}
                </MenuItem>
            </TextField>
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-sexCategory"}
                select
                label="Sex category"
                value={state.sexCategory}
                onChange={e => onValueChanged("sexCategory", e.target.value)}
                fullWidth
            >
                <MenuItem key={"N"} value={"N"}>
                  {"All"}
                </MenuItem>
                <MenuItem key={"F"} value={"F"}>
                  {"Female"}
                </MenuItem>
                <MenuItem key={"M"} value={"M"}>
                  {"Male"}
                </MenuItem>
            </TextField>
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-registrationFee"}
                label="Registration fee (eur)"
                value={state.registrationFee}
                onChange={e => onValueChanged("registrationFee", e.target.value)}
                fullWidth
                type="number"
            />
        </Box>
    </>);
}

class CreateTournament extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            name: "",
            capacity: 8,
            ageCategory: "Everyone",
            sexCategory: "N",
            teamSize: 5,
            prizes: "",
            registrationFee: 0,
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
        const { name, capacity, ageCategory, sexCategory, teamSize, prizes, registrationFee } = this.state;
        const data = { email: this.props.loggedUser.email, name, capacity, ageCategory, sexCategory, teamSize, prizes, registrationFee };
        const call = {
            action: "createTournament",
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
                            const tournaments = JSON.parse(this.responseText);
                            appOnValueChanged("tournaments", tournaments);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTournament","arguments":{"active":1}}');
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
                <Button onClick={this.open} variant="contained" color="primary">Create Tournament</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Create Tournament</DialogTitle>
                    <DialogContent>
                        <TournamentBody id={id}
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

class EditTournament extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            name: props.tournament.name,
            capacity: props.tournament.capacity,
            ageCategory: props.tournament.ageCategory,
            sexCategory: props.tournament.sexCategory,
            teamSize: props.tournament.teamSize,
            prizes: props.tournament.prizes,
            registrationFee: props.tournament.registrationFee,
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
        const { name, capacity, ageCategory, sexCategory, teamSize, prizes, registrationFee } = this.state;
        const data = { name: this.props.tournament.name, capacity, ageCategory, sexCategory, teamSize, prizes, registrationFee };
        if (this.props.tournament.name !== name)
            data.newName = name;
        const call = {
            action: "editTournament",
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
                            const tournaments = JSON.parse(this.responseText);
                            appOnValueChanged("tournaments", tournaments);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTournament","arguments":{"active":1}}');
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
        const id = this.props.tournament.id + "-edit";
        return (
            <>
                <Button onClick={this.open} variant="contained">Edit</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Edit Tournament Details</DialogTitle>
                    <DialogContent>
                        <TournamentBody id={id}
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

class SignupAsReferee extends React.Component {
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
        const data = { tournament: this.props.tournament.name, email: this.props.loggedUser.email };
        const call = {
            action: "addReferee",
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
                            const tournaments = JSON.parse(this.responseText);
                            appOnValueChanged("tournaments", tournaments);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTournament","arguments":{"active":1}}');
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
        const id = this.props.tournament.id + "-join";
        return (
            <>
                <Button onClick={this.open} variant="contained">Sign Up as Referee</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Sign Up as a Referee</DialogTitle>
                    <DialogContent>
                        Join as a referee?
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-join"} onClick={this.join} color="primary">
                            Join
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class JoinTournament extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            teams: props.loggedUsersTeams,
            selected: [],
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.submit = this.submit.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
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

    submit() {
        const close = this.close;
        const appOnValueChanged = this.props.appOnValueChanged;
        const onValueChanged = this.onValueChanged;
        const data = { tournament: this.props.tournament.name, team: this.state.selected[0] };
        const call = {
            action: "joinTournament",
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
                            const tournaments = JSON.parse(this.responseText);
                            appOnValueChanged("tournaments", tournaments);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getTournament","arguments":{"active":1}}');
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
        const tournament = this.props.tournament;
        const id = tournament.id + "-join";

        const handleToggle = value => () => {
          const currentIndex = this.state.selected.indexOf(value);
          let newChecked = [...this.state.selected];

          if (currentIndex === -1)
            newChecked = [value];
          else
            newChecked.splice(currentIndex, 1);

          this.setState({ selected: newChecked });
        };

        return (
            <>
                <Button onClick={this.open} variant="contained" disabled={this.state.teams.length === 0}>Register Team</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Teams Requesting Participation in Tournament</DialogTitle>
                    <DialogContent>
                        Choose a team to sign up for a tournament:
                        <List>
                          {this.state.teams.map(team => {
                            const labelId = `checkbox-list-label-${team.name}`;

                            return (
                              <ListItem key={team.name} role={undefined} dense button onClick={handleToggle(team.name)}>
                                <ListItemText id={labelId} primary={`${team.name}`} />
                                <ListItemSecondaryAction>
                                  <Checkbox
                                    edge="start"
                                    checked={this.state.selected.indexOf(team.name) !== -1}
                                    onChange={handleToggle(team.name)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-submit"} onClick={this.submit} color="primary">
                            Register Team
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default class Tournaments extends React.Component {
    constructor(props) {
        super(props);

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    render() {
        const TournamentPanel = (tournament) => {
            let loggedUsersTeams = [];
            if (this.props.loggedUser)
                loggedUsersTeams = this.props.teams.filter(t => t.founder === this.props.loggedUser.email);

            const teams = tournament.teams.map(t => t.name);
            const teamsStr = teams.join(', ')

            const referees = tournament.referees.map(t => t.email);
            const refereesStr = referees.join(', ')

            return (
                <ExpansionPanel key={tournament.name}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                      { tournament.name }
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
                              <td><b>Max number of teams:</b> { tournament.capacity }</td>
                              <td><b>Age category:</b> { tournament.ageCategory }</td>
                              <td><b>Sex category:</b> { tournament.sexCategory === "M"
                                                         ? "Male" : tournament.sexCategory === "F" ? "Female" : "Everyone" }</td>
                            </tr>
                            <tr>
                              <td><b>Team size:</b> { tournament.teamSize } players</td>
                              <td><b>Prize:</b> { tournament.prizes }</td>
                              <td><b>Registration fee:</b> { tournament.registrationFee } eur</td>
                            </tr>
                            <tr>
                              <td><b>Referee(s):</b> { refereesStr }</td>
                              <td><b>Teams:</b> { teamsStr }</td>
                            </tr>
                        </tbody>
                      </table>
                  </ExpansionPanelDetails>
                  {this.props.loggedUser &&
                  <ExpansionPanelActions>
                      <JoinTournament tournament={tournament} loggedUser={this.props.loggedUser} appOnValueChanged={this.props.appOnValueChanged} loggedUsersTeams={loggedUsersTeams}/>
                      <SignupAsReferee tournament={tournament} loggedUser={this.props.loggedUser} appOnValueChanged={this.props.appOnValueChanged}/>
                      {((this.props.loggedUser.email === tournament.founder) || (this.props.loggedUser.nick === "admin")) &&
                      <EditTournament tournament={tournament} appOnValueChanged={this.props.appOnValueChanged}/>}
                  </ExpansionPanelActions>}
                </ExpansionPanel>
            );
        };

        const body = this.props.tournaments.map(tournament => TournamentPanel(tournament));

        return(
            <Grid container spacing={3}>
                {this.props.loggedUser &&
                <Grid item xs={12}>
                    <Box display="flex" css={{ float: "right" }}>
                        <CreateTournament  loggedUser={this.props.loggedUser} appOnValueChanged={this.props.appOnValueChanged}/>
                    </Box>
                </Grid>}
                <Grid item xs={12}>
                    { body }
                </Grid>
            </Grid>
        );
    };
}
