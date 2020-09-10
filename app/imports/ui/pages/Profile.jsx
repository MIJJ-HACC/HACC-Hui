import React from 'react';
import _ from 'lodash';
import { Grid, Icon, Segment, Button, List, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Developers } from '../../api/user/DeveloperCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { DeveloperChallenges } from '../../api/user/DeveloperChallengeCollection';

/**
 * A simple profile page showing the users info.
 * @memberOf ui/pages
 */
class Profile extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const { firstName, lastName, lookingForTeam, linkedIn,
      gitHub, website, aboutMe, tools, skills } = Developers.dumpOne(this.props.developer[0]._id);
    const challenges = [];
    // get the challenges belonging to the user
    _.forEach(this.props.developerChallenges, (c) => _.forEach(this.props.challenges, (p) => {
      (c.challengeID === p._id) ? challenges.push(p.title) : '' }));

    return (
        <Grid stackable={true} textAlign='center' container>

          <Grid.Row columns={3}>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
              <h1>{firstName} {lastName}</h1>
            </Grid.Column>
            <Grid.Column floated='right'>
              <Link to={`/editprofile/${this.props.developer[0]._id}`}>Edit</Link>
              <Icon name='edit' size='big'/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment textAlign='left'>
                <h1>Team</h1>
                {!lookingForTeam ? <p>Team Name</p> : <Button>Find A Team</Button>}
              </Segment>
              <Segment textAlign='left'>
                {linkedIn ? (<div><h5><Icon name='linkedin' size='large'/>LinkedIn</h5>
                  <p>{linkedIn}</p><br/></div>) : ''}
                {gitHub ? (<div><h5><Icon name='github' size='large'/>Github</h5>
                  <p>{gitHub}</p><br/></div>) : ''}
                {website ? (<div><h5><Icon name='computer' size='large'/>Website</h5>
                  <p>{website}</p></div>) : ''}
              </Segment>
              <Segment textAlign='left'>
                <h1>About Me</h1>
                <p>{aboutMe}</p>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment textAlign='left'>
                <h1>Skills</h1>
                <List horizontal>
                  {skills ? skills.map((s) =>
                          <List.Item key={s}>
                            <Segment>
                              {s}
                            </Segment>
                          </List.Item>) :
                      <p>no skills listed, please edit your profile to add some</p>}
                </List>
              </Segment>
              <Segment textAlign='left'>
                <h1>Tools</h1>
                <List horizontal>
                  {tools ? tools.map((t) =>
                          <List.Item key={t}>
                            <Segment>
                              {t}
                            </Segment>
                          </List.Item>) :
                      <p>no tools listed, please edit your profile to add some</p>}
                </List>
              </Segment>
              <Segment textAlign='left'>
                <h1>Challenges</h1>
                {challenges ? challenges.map((c) => <Segment key={c}><p>{c}</p></Segment>) :
                    <p>no challenges listed, please edit your profile to add some</p>}
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
    );
  }
}

Profile.propTypes = {
  tools: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  developer: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developerChallenges: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to documents.
  const toolsSubscription = Tools.subscribe();
  const skillsSubscription = Skills.subscribe();
  const developersSubscription = Developers.subscribe();
  const challengesSubscription = Challenges.subscribe();
  const developerChallengesSubscription = DeveloperChallenges.subscribe();

  return {
    tools: Tools.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    developer: Developers.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    developerChallenges: DeveloperChallenges.find({}).fetch(),
    ready: toolsSubscription.ready() && skillsSubscription.ready() &&
        developersSubscription.ready() && challengesSubscription.ready() &&
        developerChallengesSubscription.ready(),
  };
})(Profile);
