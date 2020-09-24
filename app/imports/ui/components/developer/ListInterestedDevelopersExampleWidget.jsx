import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header } from 'semantic-ui-react';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { DeveloperInterests } from '../../../api/user/DeveloperInterestCollection';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';

class ListInterestedDevelopersExampleWidget extends React.Component {

  render() {
    return (
        <Grid.Row columns={5}>
          <Grid.Column>
            <Header as="h3">{this.props.developer.firstName} {this.props.developer.lastName}</Header>
          </Grid.Column>
		  <Grid.Column>
            <Header as="h3">{this.props.developer.username}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.developerChallenges}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.developerSkills}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.developerTools}</Header>
          </Grid.Column>
        </Grid.Row>
    );
  }
}

ListInterestedDevelopersExampleWidget.propTypes = {
  developer: PropTypes.object,
  developerName: PropTypes.string,
  developerChallenges: PropTypes.string,
  developerSkills: PropTypes.string,
  developerTools: PropTypes.string,
};

export default ListInterestedDevelopersExampleWidget;