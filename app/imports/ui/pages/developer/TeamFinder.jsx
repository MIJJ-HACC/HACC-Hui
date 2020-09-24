import React from 'react';
import { Grid, Segment, Loader, Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import TeamListItem from '../../components/developer/TeamListItem';

// create the options for the dropdown filters
const options = (data, key) => {
  const values = _.map(data, key);
  const retVal = [];

  for (let i = 0; i < values.length; i++) {
    retVal.push({
      key: values[i],
      text: values[i],
      value: values[i],
    });
  }
  return retVal;
};

/**
 * Renders the Page for finding teams.
 * @memberOf ui/pages
 */
class TeamFinder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      challenges: [],
      tools: [],
      skills: [],
      results: this.props.teams,
      teams: this.props.teams,
    };
  }

  /** Render the page. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // get the challenges associated with a team
  getTeamChallenges = (team) => {
    const teamID = team._id;
    const teamChallengeDocs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = teamChallengeDocs.map((tc) => Challenges.findDoc(tc.challengeID).title);
    return challengeTitles;
  };

  getTeamSkills = (team) => {
    const teamID = team._id;
    const teamSkills = TeamSkills.find({ teamID }).fetch();
    const skillNames = teamSkills.map((ts) => Skills.findDoc(ts.skillID).name);
    return skillNames;
  };

  getTeamTools = (team) => {
    const teamID = team._id;
    const teamTools = TeamTools.find({ teamID }).fetch();
    const toolNames = teamTools.map((tt) => Tools.findDoc(tt.toolID).name);
    return toolNames;
  };

  // updates the filter values
  onChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  };

  // filters through choices and displays matching teams
  filter = () => {
    const { challenges, tools, skills, teams } = this.state;
    let results = teams;
    let tc = [];
    let ts = [];
    let tt = [];

    if (challenges.length === 0 && tools.length === 0 && skills.length === 0) {
      console.log('no filter');
    } else {
      _.forEach(teams, (team) => {
        if (team.open) {
          // challenges
          tc = this.getTeamChallenges(team);
          // if no challenges filtered, move on
          if (challenges.length !== 0) {
            // check if team has all of the filtered challenges
            if (_.difference(challenges, tc).length !== 0) {
              results = _.filter(results, (res) => team !== res);
            }
          }

          // skills
          ts = this.getTeamSkills(team);
          if (skills.length !== 0) {
            if (_.difference(skills, ts).length !== 0) {
              results = _.filter(results, (res) => team !== res);
            }
          }

          // tools
          tt = this.getTeamTools(team);
          if (tools.length !== 0) {
            if (_.difference(tools, tt).length !== 0) {
              results = _.filter(results, (res) => team !== res);
            }
          }
        } else {
          results = _.filter(results, (res) => team !== res);
        }

      });
    }

    this.setState({
      results,
    });

  };

  renderPage() {
    let { results } = this.state;
    results = _.filter(results, (res) => res.open);
    return (
      <Grid centered container>
        <Segment style={{ marginTop: '20px' }}>
          <Grid stackable container relaxed>
            <Grid.Row columns={4}>
              <Grid.Column>
                <Dropdown
                    name='challenges'
                    placeholder='filter challenges'
                    clearable
                    fluid
                    multiple selection
                    options={options(this.props.challenges, 'title')}
                    onChange={this.onChange}/>
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                    name='tools'
                    placeholder='filter tools'
                    clearable
                    fluid
                    multiple selection
                    options={options(this.props.tools, 'name')}
                    onChange={this.onChange}/>
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                    name='skills'
                    placeholder='filter skills'
                    clearable
                    fluid
                    multiple selection
                    options={options(this.props.skills, 'name')}
                    onChange={this.onChange}/>
              </Grid.Column>
              <Grid.Column>
                <Button onClick={this.filter}>update search</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Grid.Row>{results.length} matches found</Grid.Row>
        <Grid.Row centered columns={3}>
          {results.length === 0 ?
            (<h3>Sorry, no teams match your search</h3>) :
            results.map((team) => (
              <Grid.Column key={team._id} style={{ minWidth: '300px', paddingBottom: '10px' }}>
                <TeamListItem key={team._id}
                              team={team}
                              teamChallenges={this.getTeamChallenges(team)}
                              teamSkills={this.getTeamSkills(team)}
                              teamTools={this.getTeamTools(team)}
                />
              </Grid.Column>
            ))
          }
        </Grid.Row>
      </Grid>
    );
  }
}

TeamFinder.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),

};

export default withTracker(() => {
  const subscriptionChallenges = Challenges.subscribe();
  const subscriptionSkills = Skills.subscribe();
  const subscriptionTools = Tools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  const teams = Teams.find({}).fetch();

  return {
    teams,
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready(),
  };
})(TeamFinder);
