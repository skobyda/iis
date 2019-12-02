import React from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
        const close = this.close;
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
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error") {
                    appOnValueChanged("loggedUser", null);
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const users = JSON.parse(this.responseText);
                            appOnValueChanged("users", users);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    request.send('{"action":"getPlayer","arguments":{"active":1}}');
                }
                close();
            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send(callStr);
    }

    render() {
        const id = this.props.id + "-delete-player";

        return (
            <>
                <Button onClick={this.open} color="secondary">Delete</Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-dialog"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-dialog-title"}>Account Deletion</DialogTitle>
                    <DialogContent>
                        Do you really wish to delete your profile?
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

class Logout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.logout = this.logout.bind(this);
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

    logout() {
        this.props.appOnValueChanged("loggedUser", undefined);
    }

    render() {
        const id = this.props.id + "-logout";

        return (
            <>
                <Button onClick={this.open}>
                    Logout
                </Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-dialog"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-dialog-title"}>Logout</DialogTitle>
                    <DialogContent>
                        Do you really wish to logout?
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-edit-profile"} onClick={this.logout} color="primary">
                            Logout
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            email: props.loggedUser.email,
            nick: props.loggedUser.nick,
            name: props.loggedUser.name,
            surname: props.loggedUser.surname,
            password: "",
            gender: props.loggedUser.gender,
            birthDate: props.loggedUser.birthDate,
            country: props.loggedUser.country,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.editProfile = this.editProfile.bind(this);
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

    editProfile() {
        const close = this.close;
        const onValueChanged = this.onValueChanged;
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
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error") {
                    const data = { email };
                    const call = {
                        action: "getPlayer",
                        arguments: data
                    };
                    const callStr = JSON.stringify(call);
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const response = JSON.parse(this.responseText);

                            appOnValueChanged("loggedUser", response[0]);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    //request.setRequestHeader("Content-type", "application/json");
                    request.send(callStr);
                    close();
                } else
                    onValueChanged("errorMessage", response.message);
            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send(callStr);
    }

    render() {
        const id = this.props.id + "=registration";

        return (
            <>
                <Button onClick={this.open}>
                    Edit Profile
                </Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-dialog"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-dialog-title"}>Edit Profile</DialogTitle>
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
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-edit-profile"} onClick={this.editProfile} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            email: "",
            nick: "",
            password: "",
            repeatPassword: "",
            gender: "",
            birthDate: undefined,
            errorMessage: "",
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.register = this.register.bind(this);
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

    register() {
        const onValueChanged = this.onValueChanged;
        const close = this.close;
        const { email, password } = this.state;
        const data = { email, password };
        const call = {
            action: "register",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error")
                    close();
                else
                    onValueChanged("errorMessage", response.message);

            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        request.send(callStr);
    }

    render() {
        const id = this.props.id + "=registration";

        return (
            <>
                <Button onClick={this.open}>
                    Register
                </Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-dialog"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-dialog-title"}>Registration</DialogTitle>
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
                            <TextField id={id + "-password"}
                                label="Password"
                                value={this.state.password}
                                onChange={e => this.onValueChanged("password", e.target.value)}
                                type="password"
                                fullWidth
                            />
                        </Box>
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-register"} onClick={this.register} color="primary">
                            Register
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            email: "",
            password: ""
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.login = this.login.bind(this);
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

    login() {
        const close = this.close;
        const onValueChanged = this.onValueChanged;
        const appOnValueChanged = this.props.appOnValueChanged;
        const { email, password } = this.state;
        const data = { email, password };
        const call = {
            action: "login",
            arguments: data
        };
        const callStr = JSON.stringify(call);

        const request= new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);

                if (response.result && response.result !== "Error") {
                    const data = { email };
                    const call = {
                        action: "getPlayer",
                        arguments: data
                    };
                    const callStr = JSON.stringify(call);
                    const request= new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            const response = JSON.parse(this.responseText);

                            appOnValueChanged("loggedUser", response[0]);
                        }
                    }
                    request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
                    //request.setRequestHeader("Content-type", "application/json");
                    request.send(callStr);
                    close();
                } else
                    onValueChanged("errorMessage", response.message);
            }
        }
        request.open("POST", "https://cors-anywhere.herokuapp.com/http://www.stud.fit.vutbr.cz/~xholas09/IIS/backend_api.php", true);
        //request.setRequestHeader("Content-type", "application/json");
        request.send(callStr);
    }

    render() {
        const id = this.props.id + "-login";
        return (
            <>
                <Button onClick={this.open}>
                    Login
                </Button>
                <Dialog open={this.state.showModal}
                    onClose={this.close}
                    aria-labelledby={id + "-modal"}
                    maxWidth={'sm'}
                    fullWidth
                >
                    <DialogTitle id={id + "-modal-title"}>User Login</DialogTitle>
                    <DialogContent>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-email"}
                                label="Email"
                                value={this.state.email}
                                onChange={e => this.onValueChanged("email", e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-password"}
                                label="Password"
                                value={this.state.password}
                                onChange={e => this.onValueChanged("password", e.target.value)}
                                type="password"
                                fullWidth
                            />
                        </Box>
                        <span style={{ color: "red" }}>
                            { this.state.errorMessage && (<br />) }
                            { this.state.errorMessage }
                        </span>
                    </DialogContent>
                    <DialogActions>
                        <Button id={id + "-action-close"} onClick={this.close} color="default">
                            Close
                        </Button>
                        <Button id={id + "-action-login"} onClick={this.login} color="primary">
                            Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const UserPanel = ({ appOnValueChanged, loggedUser }) => {
    const id = "user-panel";

    if (!loggedUser) {
        return (
            <Box display="flex" m={1} p={1} bgcolor="background.paper" css={{ float: "right" }}>
                <Login id={id} appOnValueChanged={appOnValueChanged} />
                <Register id={id} />
            </Box>
        );
    }
    return (
        <Box display="flex" m={1} p={1} bgcolor="background.paper" css={{ float: "right" }}>
            <EditProfile id={id} appOnValueChanged={appOnValueChanged} loggedUser={loggedUser} />
            <Logout id={id} appOnValueChanged={appOnValueChanged} />
            <Delete id={id} appOnValueChanged={appOnValueChanged} player={loggedUser} />
        </Box>
    );
}

export default UserPanel;
