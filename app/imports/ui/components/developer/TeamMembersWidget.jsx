import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Segment, List } from 'semantic-ui-react';
import { Developers } from '../../../api/user/DeveloperCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';

class TeamMembersWidget extends React.Component {

  render() {
    const { _id } = this.props.team;
    const devs = TeamDevelopers.find({teamID: _id}).fetch();
    
    console.log(devs);
    return (
      <div>
      <Segment>
        <h5>current members</h5>
        <Grid.Row>
          {devs.map((dev) => {<p>{dev}</p>})}
        </Grid.Row>
      </Segment>
      </div>
    );
  }
}

TeamMembersWidget.propTypes = {
  team: PropTypes.object,
};

export default TeamMembersWidget;
