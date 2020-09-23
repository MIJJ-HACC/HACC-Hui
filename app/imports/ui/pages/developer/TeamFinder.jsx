import React from 'react';
import { Grid, Segment, Header, Divider, Loader, Modal, Dropdown, Button } from 'semantic-ui-react';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import TeamListItem from '../../components/developer/TeamListItem';

// create the options for the dropdown filters
const options = (data, key) => {
  const values = _.map(data, key);
  const retVal = [];

  retVal.push({
    key: 'test',
    text: 'test',
    value: 'test',
  })

  for (let i = 0; i < values.length; i++) {
    retVal.push({
      key: values[i],
      text: values[i],
      value: values[i],
    });
  }
  return retVal;
}

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

    if (challenges.length === 0 && tools.length === 0 && skills.length === 0){
      console.log('no filter');
    } else {
      _.forEach(teams, (team) => {
        /** challenges **/
        tc = this.getTeamChallenges(team);
        // if no challenges filtered, move on
        if (challenges.length !== 0) {
          // check if team has all of the filtered challenges
          if (_.difference(challenges, tc).length !== 0) {
            results = _.filter(results, (res) => {return team !== res});
          }
        }

        /** skills **/
        ts = this.getTeamSkills(team);
        if (skills.length !== 0) {
          if (_.difference(skills, ts).length !== 0) {
            results = _.filter(results, (res) => {return team !== res});
          }
        }

        /** tools **/
        tt = this.getTeamTools(team);
        if (tools.length !== 0) {
          if (_.difference(tools, tt).length !== 0) {
            results = _.filter(results, (res) => {return team !== res});
          }
        }

      });
    };

    this.setState({
      results,
    });

  }

  renderPage() {
    const { results } = this.state;
    console.log(this.state.teams[0]);
    return (
        <Grid centered container>
          <h1>options</h1>
          <Grid.Row stackable={true} columns={4}>
            <Grid.Column>
              <Dropdown name='challenges' placeholder='add challenges' fluid multiple selections options={options(this.props.challenges, 'title')} onChange={this.onChange}/>
            </Grid.Column>
            <Grid.Column>
              <Dropdown name='tools' placeholder='add tools' fluid multiple selections options={options(this.props.tools, 'name')} onChange={this.onChange}/>  
            </Grid.Column>
            <Grid.Column>
              <Dropdown name='skills' placeholder='add skills' fluid multiple selections options={options(this.props.skills, 'name')} onChange={this.onChange}/>
            </Grid.Column>
            <Grid.Column>
              <Button onClick={this.filter}>search</Button>  
            </Grid.Column>
          </Grid.Row>
          <hr />
          <h1>results</h1>
          <Grid.Row stackable={true} centered columns={2}>
            {results.length === 0 ?
              (<h3>Sorry, no teams match your search</h3>) :
              results.map((team) => (
                <TeamListItem key={team._id}
                              team={team}
                              teamChallenges={this.getTeamChallenges(team)}
                              teamSkills={this.getTeamSkills(team)}
                              teamTools={this.getTeamTools(team)}
                />
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
