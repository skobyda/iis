import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './styles.css';

function getTournaments() {
    // TODO api call to get Tournaments

    // API returns JSON string like this:
    const tournamentsJSON = '[{"id":1,"name":"KATOWICE 2020","maxNumOfTeams":8,"requiredNumOfPlayers":5,"prizes":"1. 50000eur, 2. 10000eur, 3. 2000eur","tournamentAgeCategory":"Junior","tournamentSexCategory":"M","registrationFee":"500eur","founderId":42},{"id":2,"name":"CSGO International","maxNumOfTeams":10,"requiredNumOfPlayers":6,"prizes":"1. 10000eur, 2. 5000eur, 3. 2000eur","tournamentAgeCategory":"Casual","tournamentSexCategory":"M","registrationFee":"100eur","founderId":32},{"id":3,"name":"Counter-Strike Girlz","maxNumOfTeams":16,"requiredNumOfPlayers":5,"prizes":"1. 50000eur, 2. 10000eur, 3. 2000eur","tournamentAgeCategory":"Casual","tournamentSexCategory":"F","registrationFee":"500eur","founderId":42}]';

    return JSON.parse(tournamentsJSON);
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
