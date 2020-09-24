import React from 'react';
import { Grid, Segment, Form, Header, Button, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, TextField, LongTextField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../controllers/MultiSelectField';
import RadioField from '../../controllers/RadioField';
import { Teams } from '../../../api/team/TeamCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';

/**
 * Renders the Page for adding teams.
 * @memberOf ui/pages
 */
class UpdateTeamWidget extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(formData) {
    const challengesArray = this.props.allChallenges;
    const challengesObject = [];
    const skillsArray = this.props.allSkills;
    const skillsObject = [];
    const toolsArray = this.props.allTools;
    const toolsObject = [];
    const developersArray = this.props.allDevelopers;
    const developersObject = [];
    const { name, devPostPage, description, challenges, skills, tools, developers } = formData;
    let { open } = formData;
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
    }
    for (let i = 0; i < skillsArray.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsArray[i].name === skills[j]) {
          skillsObject.push(Slugs.getNameFromID(skillsArray[i].slugID));
        }
      }
    }
    for (let i = 0; i < toolsArray.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsArray[i].name === tools[j]) {
          toolsObject.push(Slugs.getNameFromID(toolsArray[i].slugID));
        }
      }
    }
    for (let i = 0; i < challengesArray.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArray[i].title === challenges[j]) {
          challengesObject.push(Slugs.getNameFromID(challengesArray[i].slugID));
        }
      }
    }
    for (let i = 0; i < developersArray.length; i++) {
      for (let j = 0; j < developers.length; j++) {
        if (developersArray[i].username === developers[j]) {
          developersObject.push(Slugs.getNameFromID(developersArray[i].slugID));
        }
      }
    }
    const id = this.props.team._id;
    const collectionName = Teams.getCollectionName();
    const updateData = { id, name, description, open, devPostPage, challengesObject,
      skillsObject, toolsObject, developersObject };
    console.log(updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Team successfully updated.', 'success');
        // eslint-disable-next-line react/prop-types
        this.props.history.push('/', { some: 'state' });
      }
    });
  }

  buildTheModel() {
    const { name, description, gitHubRepo, devPostPage } = this.props.team;
    let open = '';
    if (this.props.team.open === true) {
      open = 'Open';
    } else {
      open = 'Closed';
    }
    const challenges = _.map(this.props.teamChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    const developers = _.map(this.props.teamDevelopers, (developer) => {
      const d = Developers.findDoc(developer.developerID);
      return d.username;
    });
    const skills = _.map(this.props.teamSkills, (skill) => {
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    const tools = _.map(this.props.teamTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      return t.name;
    });
    const model = {
      name, description, gitHubRepo, devPostPage, open, challenges,
      developers, skills, tools,
    };
    return model;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    // console.log(Teams.dumpAll());
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    const schema = new SimpleSchema({
      name: String,
      gitHubRepo: {
        label: 'GitHub Repo',
        type: String,
        optional: true,
      },
      devPostPage: {
        label: 'DevPost Page',
        type: String,
        optional: true,
      },
      open: {
        type: String,
        allowedValues: ['Open', 'Closed'],
        label: 'Availability',
      },
      challenges: { type: Array, label: 'Challenges' },
      'challenges.$': { type: String },
      skills: { type: Array, label: 'Skills' },
      'skills.$': { type: String },
      tools: { type: Array, label: 'Toolsets' },
      'tools.$': { type: String },
      developers: { type: Array, label: 'Developers' },
      'developers.$': { type: String },
      description: String,
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    const challengesArray = _.map(this.props.allChallenges, 'title');
    const skillsArray = _.map(this.props.allSkills, 'name');
    const toolsArray = _.map(this.props.allTools, 'name');
    const developersArray = _.map(this.props.allDevelopers, 'username');
    const model = this.buildTheModel();
    return (
        <div>
          <Grid container centered>
            <Grid.Column>
              <AutoForm ref={ref => { fRef = ref; }}
                        schema={formSchema}
                        onSubmit={data => this.submit(data)}
                        model={model}
                        style={{
                          paddingBottom: '40px',
                        }}>
                <Segment style={{
                  borderRadius: '10px',
                  backgroundColor: '#5C93D1',
                }}>
                  <Header as="h2" textAlign="center" inverted>Update Team</Header>
                  <Form.Group widths="equal">
                    <TextField disabled name='name' value={`${this.props.team.name}`} />
                    <TextField disabled name='gitHubRepo'/>
                  </Form.Group>
                  <RadioField name='open' inline />
                  <TextField name='devPostPage' />
                  <Form.Group widths="equal">
                    <MultiSelectField name='challenges' allowedValues={challengesArray} />
                    <MultiSelectField name='skills' allowedValues={skillsArray} />
                    <MultiSelectField name='tools' allowedValues={toolsArray} />
                  </Form.Group>
                  <MultiSelectField name='developers' placeholder={'Developers'}
                                    allowedValues={developersArray}/>
                  <LongTextField name='description' placeholder={'About the team'} />
                  <Button type='button' onClick={() => {
                    // eslint-disable-next-line no-undef
                    if (window.confirm('Are you sure you wish to update this team?')) {
                      fRef.submit();
                    }
                  }}>
                    Update Team
                  </Button>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

UpdateTeamWidget.propTypes = {
  allChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  allSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  allTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
  allDevelopers: PropTypes.arrayOf(
      PropTypes.object,
  ),
  teamChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  developer: PropTypes.object.isRequired,
  teamDevelopers: PropTypes.arrayOf(
      PropTypes.object,
  ),
  teamSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  teamTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
  team: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  const teamID = match.params._id;
  const allChallenges = Challenges.find({}).fetch();
  const allSkills = Skills.find({}).fetch();
  const allTools = Tools.find({}).fetch();
  const allDevelopers = Developers.find({}).fetch();
  const developer = Developers.findDoc({ userID: Meteor.userId() });
  const team = Teams.findDoc({ _id: teamID });
  const developerID = developer._id;
  const teamChallenges = TeamChallenges.find({ teamID }).fetch();
  const teamDevelopers = TeamDevelopers.find({ teamID }).fetch();
  const teamSkills = TeamSkills.find({ teamID }).fetch();
  const teamTools = TeamTools.find({ teamID }).fetch();

  const subChallenges = Challenges.subscribe();
  const subSkills = Skills.subscribe();
  const subTools = Tools.subscribe();
  const subDev = Developers.subscribe();
  const subTC = TeamChallenges.subscribe();
  const subTD = TeamDevelopers.subscribe();
  const subTS = TeamSkills.subscribe();
  const subTT = TeamTools.subscribe();
  const subTeams = Teams.subscribe();
  return {
    teamID,
    allChallenges,
    allSkills,
    allTools,
    allDevelopers,
    developer,
    developerID,
    teamChallenges,
    teamDevelopers,
    teamSkills,
    teamTools,
    team,
    ready: subChallenges.ready() && subSkills.ready() && subTools.ready() && subDev.ready() && subTC.ready() &&
        subTD.ready() && subTS.ready() && subTT.ready() && subTeams.ready(),
  };
})(UpdateTeamWidget);
