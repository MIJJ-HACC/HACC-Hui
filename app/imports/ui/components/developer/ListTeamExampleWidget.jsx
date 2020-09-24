import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header } from 'semantic-ui-react';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ListTeamExampleWidget extends React.Component {

  //This is the mechanism for the request button to join
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
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
  }


  render() {
//    const owner = this.findDoc(docID).owner;
    const user = Developers.findDoc({userID: Meteor.userId() }).slugID;
    console.log(user);
  //console.log(this.props.currentUser);
   //const ownerSlug = Developers.findSlugByID(owner);
   //console.log(ownerSlug)
    // const isOwner = this.props.currentUser && ownerSlug;

    return (
        <Grid.Row columns={6}>
          <Grid.Column>
            <Header as="h3">{this.props.team.owner}</Header>
          </Grid.Column>

          <Grid.Column>
            <Header as="h3">{this.props.team.owner}</Header>
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

              <Button type='button' onClick={() => {
               // eslint-disable-next-line no-undef

                  if (window.confirm('Are you sure you wish to delete your team?')) {
                    fRef.submit();
                  }

              }} color='red'>
                Delete Team
              </Button>


          </Grid.Column>
        </Grid.Row>
    );
  }
}

ListTeamExampleWidget.propTypes = {
  developer: PropTypes.object,
  team: PropTypes.object,
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
