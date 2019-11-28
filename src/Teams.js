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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import './styles.css';

function getTeams() {
    // TODO api call to get teams

    // API returns JSON string like this:
    const teamsJSON = '[{"id":1,"name":"Ninjas in Pyjamas","funded":"08-10-2018","players":["PashaBiceps","ZywOo","s1mple","XANTARES","Kaze"],"requests":["KSCERATO","Sico"]},' +
                       '{"id":2,"name":"Furia Esports","funded":"02-12-2015","players":["coldzera","BnTeT","Sico","KSCERATO","device"],"requests":[]}]';

    return JSON.parse(teamsJSON);
}

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
        const { name, players } = this.state;
        const data = { name, players };
        const jsonStr = JSON.stringify(data);

        console.log("Create Team API. Passed data:");
        console.log(jsonStr);
        // TODO backend
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

class RequestsTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            players: props.team.players,
            selected: [],
            requests: props.team.requests,
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
        const id = this.props.team.id;
        const data = { id, selected };
        const jsonStr = JSON.stringify(data);

        console.log("Requests Team Accepted API. Passed data:");
        console.log(jsonStr);

        const newRequests = [];

        this.props.team.requests.forEach(req => {
            if (!selected.includes(req))
                newRequests.push(req);
        });
        console.log(newRequests);
        this.setState({ requests: newRequests });
      // TODO backend
    }

    deny() {
        const selected = this.state.selected;
        const id = this.props.team.id;
        const data = { id, selected };
        const jsonStr = JSON.stringify(data);

        console.log("Requests Team Declined API. Passed data:");
        console.log(jsonStr);
        // TODO backend

        const newRequests = [];

        this.props.team.requests.forEach(req => {
            if (!selected.includes(req))
                newRequests.push(req);
        });
        this.setState({ requests: newRequests });
    }

    render() {
        const team = this.props.team;
        const id = team.id + "-requests";

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
                <Button onClick={this.open} variant="contained" disabled={team.requests.length === 0} color={team.requests.length ? "primary" : "default"}>{team.requests.length} Requests</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Players Requesting Team Membership</DialogTitle>
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
        const { name, players } = this.state;
        const id = this.props.team.id;
        const data = { id, name, players };
        const jsonStr = JSON.stringify(data);

        console.log("Edit Team API. Passed data:");
        console.log(jsonStr);
        // TODO backend
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
        const data = { id: this.props.team.id };
        const jsonStr = JSON.stringify(data);

        console.log("Join Team API. Passed data:");
        console.log(jsonStr);
        // TODO backend
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
                        Submit a request to join this team?
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


class DeleteTeam extends React.Component {
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
        const data = { id: this.props.team.id };
        const jsonStr = JSON.stringify(data);

        console.log("Delete Team API. Passed data:");
        console.log(jsonStr);
        // TODO backend
    }

    render() {
        const id = this.props.team.id + "-delete";
        return (
            <>
                <Button onClick={this.open} variant="contained" color="secondary">Delete</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>Delete Team</DialogTitle>
                    <DialogContent>
                        Do you really wish to delete this team?
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

export default class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: getTeams()
        };

        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(key, value) {
        this.setState({ [key]: value });
    }

    render() {
        const TeamPanel = (team) => {
            const playersStr = team.players.join(", ");

            return (
                <ExpansionPanel key={ team.id }>
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
                              <td><b>Founded:</b> { team.funded }</td>
                            </tr>
                        </tbody>
                      </table>
                  </ExpansionPanelDetails>
                  <ExpansionPanelActions>
                      <RequestsTeam team={team}/>
                      <JoinTeam team={team}/>
                      <EditTeam team={team}/>
                      <DeleteTeam team={team}/>
                  </ExpansionPanelActions>
                </ExpansionPanel>
            );
        };

        const body = this.state.teams.map(team => TeamPanel(team));

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box display="flex" css={{ float: "right" }}>
                        <CreateTeam />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    { body }
                </Grid>
            </Grid>
        );
    };
}
