import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './styles.css';

function getTeams() {
    // TODO api call to get teams

    // API returns JSON string like this:
    const teamsJSON = '[{"id":1,"name":"Ninjas in Pyjamas","funded":"08-10-2018","players":["PashaBiceps","ZywOo","s1mple","XANTARES","Kaze"]},' +
                       '{"id":2,"name":"Furia Esports","funded":"02-12-2015","players":["coldzera","BnTeT","Sico","KSCERATO","device"]}]';

    return JSON.parse(teamsJSON);
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
                  </ExpansionPanelActions>
                </ExpansionPanel>
            );
        };

        const body = this.state.teams.map(team => TeamPanel(team));

        return(
            <>
                { body }
            </>
        );
    };
}
