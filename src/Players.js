import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
