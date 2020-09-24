import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header } from 'semantic-ui-react';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import swal from 'sweetalert';
import { InterestedDevs } from '../../../api/team/InterestedDeveloperCollection';

class ListTeamExampleWidget extends React.Component {
  handleClick(e, inst) {
    console.log(e, inst);
	const collectionName = WantsToJoin.getCollectionName();
    const teamDoc = Teams.findDoc(inst.id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const developer = Developers.findDoc({ userID: Meteor.userId() }).username;
    const definitionData = {
      team,
      developer,
    };
	console.log(e, inst);
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
	const NewcollectionName = InterestedDevs.getCollectionName();
    console.log(NewcollectionName, definitionData);
    defineMethod.call({ collectionName: NewcollectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
  }

  handleClickDelete = () => {
    const id = this.props.team._id;

    removeItMethod.call({ collectionName: Teams.getCollectionName(), instance: id }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Team deleted successfully.', 'success');
        // eslint-disable-next-line react/prop-types
      }
    });
    //if (window.confirm('Are you sure you wish to delete your account?')) {
      //fRef.submit();
    //}
  }

  render() {
    const developer = Developers.findDoc({ userID: Meteor.userId() }).username;
    const isOwner = (this.props.team.owner === Developers.findDoc({ userID: Meteor.userId() })._id);

    return (
        <Grid.Row columns={5}>
          <Grid.Column>
            <Header as="h3">{this.props.team.name}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.teamChallenges.join(',')}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.teamSkills.join(',')}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.teamTools.join(',')}</Header>
          </Grid.Column>
          <Grid.Column>
            <Button id={this.props.team._id} color="green" onClick={this.handleClick}>Request to Join</Button>
            { isOwner ? (
                [<Button color="red" id={this.props.team._id} content='Delete Team' onClick={this.handleClickDelete}>Delete Team</Button>]) : ''}
          </Grid.Column>
        </Grid.Row>
    );
  }
}

ListTeamExampleWidget.propTypes = {
  team: PropTypes.object,
  teamDevelopers: PropTypes.object.isRequired,
  teamChallenges: PropTypes.arrayOf(
      PropTypes.string,
  ),
  teamSkills: PropTypes.arrayOf(
      PropTypes.string,
  ),
  teamTools: PropTypes.arrayOf(
      PropTypes.string,
  ),
};

export default ListTeamExampleWidget;
