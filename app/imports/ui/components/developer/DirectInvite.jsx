import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Segment, List, Dropdown } from 'semantic-ui-react';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { InterestedDevs } from '../../../api/team/InterestedDeveloperCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { withTracker } from 'meteor/react-meteor-data';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
//import { TeamMembersWidget } from './TeamMembersWidget';
//import { InvitedDevs } from '../../../api/team/InvitedDevsCollection';

class DirectInvite extends React.Component {

  state = { options: [], }

  // allows new values to be added to the team invite list
  handleAddition = (e, { value }) => {
    this.setState((prevState) => ({
      options: [{ text: value, value }, ...prevState.options],
    }))
  }

  handleChange = (e, { value }) => this.setState({ currentValues: value })

  handleSubmit = () => {
    const { currentValues } = this.state;
    const { _id } = this.props.team;
    let userID;

    _.forEach(currentValues, (email) => {
      // check if email is has been defined
      if (Developers.isDefined({username: email})) {
        userID = Developers.findOne({username: email})._id;
        // if user isn't in the team or been invited then invite them
        if (!TeamDevelopers.isDefined({teamID: _id, developerID: userID}) &&
              !InvitedDevs.isDefined({teamID: _id, developerID: userID})) {
          console.log(`invite ${email}`);
          this.sendInvite(email);
        // if user has requested to join the team then invite them and remove from interested
        } else if (InterestedDevs.isDefined({teamID: _id, developerID: userID})) {
          console.log(`invite ${email} and delete from interested`);
          this.sendInvite(email);
          InterestedDevs.removeIt(InterestedDevs.findOne({teamID: _id, developerID: userID})._id);
        } else {
          console.log(`error, ${email} is in the team or has already been invited`);
        }
      } else {
        console.log(`error, ${email} is either mispelled or has not yet registered`);
      }
    });
    
    this.setState({ currentValues: [] });
  }

  sendInvite = (email) => {
    const {_id } = this.props.team;
    const collectionName = InvitedDevs.getCollectionName();
    const teamDoc = Teams.findDoc(_id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const developer = email;
    const definitionData = {
      team,
      developer,
    };
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
  }

  render() {
    const { currentValues } = this.state;
    const { _id, owner } = this.props.team;

    console.log(this.props.team.owner);
    console.log(TeamDevelopers.findOne({teamID: _id, developerID: owner}));
    console.log(Developers.findOne({username: 'joshuabh@hawaii.edu'})._id);
    console.log(Developers.isDefined({username: "joshuabh@hawaii.edu"}));

    return (
      <div>
      <Segment>
        <Grid container>

          <Grid.Row centered>
            <h1>Direct Team Invite</h1>
            <h4>Here you can send a team invition directly to a participant</h4>
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Grid.Column width={3}> {/*use a list for listing team members*/}
              <h1>hi</h1>
              {/*<TeamMembersWidget team={team} /> list: owner, current members, invited members*/}
            </Grid.Column>
            <Grid.Column width={7}>
              <Dropdown
                options={this.state.options}
                placeholder='john@foo.com'
                search
                selection
                fluid
                multiple
                allowAdditions
                value={currentValues}
                onAddItem={this.handleAddition}
                onChange={this.handleChange}
              />
              <Button onClick={this.handleSubmit}>Invite members</Button>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Segment>
      </div>
    );
  }
}

DirectInvite.propTypes = {
  team: PropTypes.object,
};

export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const teamId = match.params._id;
  return {
    team: Teams.findOne(teamId),
  };
})(DirectInvite);
