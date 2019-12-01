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

function getTournaments() {
    // TODO api call to get Tournaments

    // API returns JSON string like this:
    const tournamentsJSON = '[{"id":1,"name":"KATOWICE 2020","maxNumOfTeams":8,"requiredNumOfPlayers":5,"prizes":"1. 50000eur, 2. 10000eur, 3. 2000eur","tournamentAgeCategory":"Junior","tournamentSexCategory":"M","registrationFee":"500eur","founderId":42,"requests":["Ninjas in Pyjamas","Furia Esports"]},' +
    '{"id":2,"name":"CSGO International","maxNumOfTeams":10,"requiredNumOfPlayers":6,"prizes":"1. 10000eur, 2. 5000eur, 3. 2000eur","tournamentAgeCategory":"Casual","tournamentSexCategory":"M","registrationFee":"100eur","founderId":32,"requests":[]},' +
    '{"id":3,"name":"Counter-Strike Girlz","maxNumOfTeams":16,"requiredNumOfPlayers":5,"prizes":"1. 50000eur, 2. 10000eur, 3. 2000eur","tournamentAgeCategory":"Casual","tournamentSexCategory":"F","registrationFee":"500eur","founderId":42,"requests":[]}]';

    return JSON.parse(tournamentsJSON);
}

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
            <TextField id={id + "-requiredNumOfPlayers"}
                label="Players per team"
                value={state.requiredNumOfPlayers}
                onChange={e => onValueChanged("requiredNumOfPlayers", e.target.value)}
                type="number"
                fullWidth
            />
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-maxNumOfTeams"}
                label="Max number of teams"
                value={state.maxNumOfTeams}
                onChange={e => onValueChanged("maxNumOfTeams", e.target.value)}
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
            <TextField id={id + "-tournamentAgeCategory"}
                select
                label="Age category"
                value={state.tournamentAgeCategory}
                onChange={e => onValueChanged("tournamentAgeCategory", e.target.value)}
                fullWidth
            >
                <MenuItem key={"Casual"} value={"Casual"}>
                  {"Casual"}
                </MenuItem>
                <MenuItem key={"Junior"} value={"Junior"}>
                  {"Junior"}
                </MenuItem>
            </TextField>
        </Box>
        <Box m={1} component="span" display="block">
            <TextField id={id + "-tournamentSexCategory"}
                select
                label="Sex category"
                value={state.tournamentSexCategory}
                onChange={e => onValueChanged("tournamentSexCategory", e.target.value)}
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
            <TextField id={id + "-registrationFee"}
                label="Registration fee"
                value={state.registrationFee}
                onChange={e => onValueChanged("registrationFee", e.target.value)}
                fullWidth
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
            maxNumOfTeams: 8,
            tournamentAgeCategory: "",
            tournamentSexCategory: "",
            requiredNumOfPlayers: 5,
            prizes: "",
            registrationFee: "",
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
        const { name, maxNumOfTeams, tournamentAgeCategory, tournamentSexCategory, requiredNumOfPlayers, prizes, registrationFee } = this.state;
        const data = { name, maxNumOfTeams, tournamentAgeCategory, tournamentSexCategory, requiredNumOfPlayers, prizes, registrationFee };
        const jsonStr = JSON.stringify(data);

        console.log("Create Tournament API. Passed data:");
        console.log(jsonStr);
        // TODO backend
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
            maxNumOfTeams: props.tournament.maxNumOfTeams,
            tournamentAgeCategory: props.tournament.tournamentAgeCategory,
            tournamentSexCategory: props.tournament.tournamentSexCategory,
            requiredNumOfPlayers: props.tournament.requiredNumOfPlayers,
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
        const { name, maxNumOfTeams, tournamentAgeCategory, tournamentSexCategory, requiredNumOfPlayers, prizes, registrationFee } = this.state;
        const id = this.props.tournament.id;
        const data = { id, name, maxNumOfTeams, tournamentAgeCategory, tournamentSexCategory, requiredNumOfPlayers, prizes, registrationFee };
        const jsonStr = JSON.stringify(data);

        console.log("Edit Tournament API. Passed data:");
        console.log(jsonStr);
        // TODO backend
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

class DeleteTournament extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
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
        const data = { id: this.props.tournament.id };
        const jsonStr = JSON.stringify(data);

        console.log("Delete Tournament API. Passed data:");
        console.log(jsonStr);
        // TODO backend
    }

    render() {
        const id = this.props.tournament.id + "-delete";
        return (
            <>
                <Button onClick={this.open} variant="contained" color="secondary">Delete</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Tournament Deletion</DialogTitle>
                    <DialogContent>
                        Do you really wish to delete this tournament?
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
        const data = { id: this.props.tournament.id };
        const jsonStr = JSON.stringify(data);

        console.log("Join Tournament API. Passed data:");
        console.log(jsonStr);
        // TODO backend
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
                        Submit a request to join as a referee?
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-join"} onClick={this.join} color="secondary">
                            Submit
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
            teams: ["Ninjas in Pyjamas", "Furia Esports"],
            selected: [],
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.submit = this.submit.bind(this);
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    submit() {
        const selected = this.state.selected;
        const id = this.props.tournament.id;
        const data = { id, selected };
        const jsonStr = JSON.stringify(data);

        console.log("Join Tournament Accepted API. Passed data:");
        console.log(jsonStr);

        this.close();
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
                          {this.state.teams.map(value => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                              <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                                <ListItemText id={labelId} primary={`${value}`} />
                                <ListItemSecondaryAction>
                                  <Checkbox
                                    edge="start"
                                    checked={this.state.selected.indexOf(value) !== -1}
                                    onChange={handleToggle(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-submit"} onClick={this.submit} color="primary">
                            Submit Request
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class RequestsTournament extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            players: props.tournament.players,
            selected: [],
            requests: props.tournament.requests,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.accept = this.accept.bind(this);
        this.deny = this.deny.bind(this);
    }

    close() {
        this.setState({ showModal: false, dialogError: undefined });
    }

    open() {
        this.setState({ showModal: true });
    }

    accept() {
        const selected = this.state.selected;
        const id = this.props.tournament.id;
        const data = { id, selected };
        const jsonStr = JSON.stringify(data);

        console.log("Requests Tournament Accepted API. Passed data:");
        console.log(jsonStr);

        const newRequests = [];

        this.props.tournament.requests.forEach(req => {
            if (!selected.includes(req))
                newRequests.push(req);
        });
        console.log(newRequests);
        this.setState({ requests: newRequests });
      // TODO backend
    }

    deny() {
        const selected = this.state.selected;
        const id = this.props.tournament.id;
        const data = { id, selected };
        const jsonStr = JSON.stringify(data);

        console.log("Requests Tournament Declined API. Passed data:");
        console.log(jsonStr);
        // TODO backend

        const newRequests = [];

        this.props.tournament.requests.forEach(req => {
            if (!selected.includes(req))
                newRequests.push(req);
        });
        this.setState({ requests: newRequests });
    }

    render() {
        const tournament = this.props.tournament;
        const id = tournament.id + "-requests";

        const handleToggle = value => () => {
          const currentIndex = this.state.selected.indexOf(value);
          const newChecked = [...this.state.selected];

          if (currentIndex === -1)
            newChecked.push(value);
          else
            newChecked.splice(currentIndex, 1);

          this.setState({ selected: newChecked });
        };

        return (
            <>
                <Button onClick={this.open} variant="contained" disabled={tournament.requests.length === 0} color={tournament.requests.length ? "primary" : "default"}>{tournament.requests.length} Requests</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Teams Requesting Participation in Tournament</DialogTitle>
                    <DialogContent>
                        <List>
                          {this.state.requests.map(value => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                              <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                                <ListItemText id={labelId} primary={`${value}`} />
                                <ListItemSecondaryAction>
                                  <Checkbox
                                    edge="start"
                                    checked={this.state.selected.indexOf(value) !== -1}
                                    onChange={handleToggle(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-accept"} onClick={this.accept} color="primary">
                            Accept Selected
                        </Button>
                        <Button id={id + "-action-deny"} onClick={this.deny} color="secondary">
                            Deny Selected
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

        this.state = {
            tournaments: getTournaments()
        };

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    render() {
        const TournamentPanel = (tournament) => {
            return (
                <ExpansionPanel key={tournament.id}>
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
                              <td><b>Max number of teams:</b> { tournament.maxNumOfTeams }</td>
                              <td><b>Age category:</b> { tournament.tournamentAgeCategory }</td>
                              <td><b>Sex category:</b> { tournament.tournamentSexCategory === "M"
                                                         ? "Male" : "Female" }</td>
                            </tr>
                            <tr>
                              <td><b>Team size:</b> { tournament.requiredNumOfPlayers } players</td>
                              <td><b>Prize:</b> { tournament.prizes }</td>
                              <td><b>Registration fee:</b> { tournament.registrationFee }</td>
                            </tr>
                        </tbody>
                      </table>
                  </ExpansionPanelDetails>
                  <ExpansionPanelActions>
                      <RequestsTournament tournament={tournament}/>
                      <JoinTournament tournament={tournament}/>
                      <SignupAsReferee tournament={tournament}/>
                      <EditTournament tournament={tournament}/>
￼                     <DeleteTournament tournament={tournament}/>
                  </ExpansionPanelActions>
                </ExpansionPanel>
            );
        };

        const body = this.state.tournaments.map(tournament => TournamentPanel(tournament));

        return(
            <Grid container spacing={3}>
￼                 <Grid item xs={12}>
￼                     <Box display="flex" css={{ float: "right" }}>
￼                         <CreateTournament />
￼                     </Box>
￼                 </Grid>
￼                 <Grid item xs={12}>
￼                     { body }
￼                 </Grid>
￼             </Grid>
        );
    };
}
