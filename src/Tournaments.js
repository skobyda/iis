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

import './styles.css';

function getTournaments() {
    // TODO api call to get Tournaments

    // API returns JSON string like this:
    const tournamentsJSON = '[{"id":1,"name":"KATOWICE 2020","maxNumOfTeams":8,"requiredNumOfPlayers":5,"prizes":"1. 50000eur, 2. 10000eur, 3. 2000eur","tournamentAgeCategory":"Junior","tournamentSexCategory":"M","registrationFee":"500eur","founderId":42,"requests":["Ninjas in Pyjamas","Furia Esports"]},' +
    '{"id":2,"name":"CSGO International","maxNumOfTeams":10,"requiredNumOfPlayers":6,"prizes":"1. 10000eur, 2. 5000eur, 3. 2000eur","tournamentAgeCategory":"Casual","tournamentSexCategory":"M","registrationFee":"100eur","founderId":32,"requests":[]},' +
    '{"id":3,"name":"Counter-Strike Girlz","maxNumOfTeams":16,"requiredNumOfPlayers":5,"prizes":"1. 50000eur, 2. 10000eur, 3. 2000eur","tournamentAgeCategory":"Casual","tournamentSexCategory":"F","registrationFee":"500eur","founderId":42,"requests":[]}]';

    return JSON.parse(tournamentsJSON);
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
                  </ExpansionPanelActions>
                </ExpansionPanel>
            );
        };

        const body = this.state.tournaments.map(tournament => TournamentPanel(tournament));

        return(
            <>
                { body }
            </>
        );
    };
}
