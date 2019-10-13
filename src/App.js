import React from 'react';
import './App.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import UserPanel from './userPanel.js';

function App() {
    return (
        <div className="App">
            <div>
                <AppBar position="static">
                    <Tabs aria-label="simple tabs example">
                        <Tab label="Tournaments" />
                        <Tab label="Teams" />
                        <Tab label="Players" />
                    </Tabs>
                </AppBar>
                <UserPanel />
            </div>
            <header className="App-page">
                <div className="App-content">
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>KATOWICE</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Typography>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          sit amet blandit leo lobortis eget.
                        </Typography>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>STEAM Tournament 2021</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Typography>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          sit amet blandit leo lobortis eget.
                        </Typography>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </header>
        </div>
    );
}

export default App;
