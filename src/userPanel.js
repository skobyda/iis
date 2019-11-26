import React from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
            birthdate: undefined
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
        const { email, nick, password, gender, birthdate } = this.state;
        const data = { email, nick, password, gender, birthdate };
        const jsonStr = JSON.stringify({ action: "register", data: data });

        console.log(jsonStr);
        // TODO call backend
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
                            <TextField id={id + "-nick"}
                                label="Nick"
                                value={this.state.nick}
                                onChange={e => this.onValueChanged("nick", e.target.value)}
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
                        <Box m={1} component="span" display="block">
                            <TextField id={id + "-repeat-password"}
                                label="Repeat password"
                                value={this.state.repeatPassword}
                                onChange={e => this.onValueChanged("repeatPassword", e.target.value)}
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
                            <TextField id={id + "-birthdate"}
                                label="Date of birth"
                                type="date"
                                value={this.state.birthdate}
                                onChange={e => this.onValueChanged("birthdate", e.target.value)}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                            />
                        </Box>
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
        const { email, password } = this.state;
        const data = { email, password };
        const jsonStr = JSON.stringify(data);

        console.log(jsonStr);
        // TODO backend
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

const UserPanel = () => {
    const id = "user-panel";

    return (
        <Box display="flex" m={1} p={1} bgcolor="background.paper" css={{ float: "right" }}>
            <Login id={id} />
            <Register id={id} />
        </Box>
    );
}

export default UserPanel;
