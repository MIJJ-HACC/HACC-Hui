import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Segment, List } from 'semantic-ui-react';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class TeamListItem extends React.Component {
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
    return (
      <div>
      <Segment>
        <Grid container>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h3">{this.props.team.name}</Header>
            </Grid.Column>
            <Grid.Column>
              <Button id={this.props.team._id} color="green" onClick={this.handleClick}>Request to Join</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <p>{this.props.team.description}</p>
          </Grid.Row>

          <Grid.Row textAlign='left'>
            <Grid.Column>
              <h4>Challenges</h4>
              <List horizontal>
                {this.props.teamChallenges.map((c) => <List.Item key={c}>
                  <Segment>
                    {c}
                  </Segment>
                  </List.Item>)}
              </List>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row textAlign='left'>
            <Grid.Column>
              <h4>Skills</h4>
              <List horizontal>
                {this.props.teamSkills.map((s) => <List.Item key={s}>
                  <Segment>
                    {s}
                  </Segment>
                  </List.Item>)}
              </List>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row textAlign='left'>
            <Grid.Column>
              <h4>Tools</h4>
              <List horizontal>
                {this.props.teamTools.map((t) => <List.Item key={t}>
                  <Segment>
                    {t}
                  </Segment>
                  </List.Item>)}
              </List>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Segment>
      </div>
    );
  }
}

TeamListItem.propTypes = {
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

export default TeamListItem;
