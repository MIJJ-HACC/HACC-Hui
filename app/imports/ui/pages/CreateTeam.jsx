import React from 'react';
import { Grid, Segment, Header, Loader, Button, NavLink } from 'semantic-ui-react';
import { AutoForm, ErrorsField, TextField, LongTextField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../controllers/MultiSelectField';
import RadioField from '../controllers/RadioField';
import { Teams } from '../../api/team/TeamCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Developers } from '../../api/user/DeveloperCollection';

/**
 * Renders the Page for adding teams.
 * @memberOf ui/pages
 */
class CreateTeam extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(definitionData) {
    const challengesArray = this.props.challenges;
    const challengesObject = [];
    const skillsArray = this.props.skills;
    const skillsObject = [];
    const toolsArray = this.props.tools;
    const toolsObject = [];
    const owner = this.props.developer.username;
    const { name, gitHubRepo, devPostPage, description, open, challenges, skills, tools } = definitionData;
    let openBoolean = true;
    if (open === 'Closed') {
      openBoolean = false;
    }
    for (let i = 0; i < skillsArray.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsArray[i].name === skills[j]) {
          skillsObject.push(skillsArray[i].slugID);
        }
      }
    }
    for (let i = 0; i < challengesArray.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArray[i].title === challenges[j]) {
          challengesObject.push(challengesArray[i].slugID);
        }
      }
    }
    for (let i = 0; i < toolsArray.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsArray[i].name === tools[j]) {
          toolsObject.push(toolsArray[i].slugID);
        }
      }
    }
    const data = { name, description, gitHubRepo, devPostPage, owner, openBoolean, challenges, skills, tools };
    console.log(Teams.getCollectionName());
    console.log(data);
    defineMethod.call({ collectionName: Teams.getCollectionName(), definitionData: data });
    this.props.history.push('/');
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    const schema = new SimpleSchema({
      name: {
        label: 'Team name',
        type: String,
        regEx: /^[a-z0-9]+$/,
        unique: true,
      },
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
      tools: { type: Array, label: 'Tools' },
      'tools.$': { type: String },
      description: String,
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    const challengesArray = _.map(this.props.challenges, 'title');
    const skillsArray = _.map(this.props.skills, 'name');
    const toolsArray = _.map(this.props.tools, 'name');
    return (
        <div>
          <Grid container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Create a Team</Header>
              <AutoForm ref={ref => { fRef = ref; }}
                        schema={formSchema}
                        onSubmit={data => this.submit(data)}>
                <Segment>
                  <TextField name='name' placeholder={'No spaces, lower case letters and numbers only. ' +
                    'Must be unique from other teams!'}/>
                  <RadioField name='open'/>
                  <TextField name='gitHubRepo' placeholder={'optional'}/>
                  <TextField name='devPostPage' placeholder={'optional'}/>
                  <MultiSelectField name='challenges' placeholder={'Challenges'}
                                    allowedValues={challengesArray} required/>
                  <MultiSelectField name='skills' placeholder={'Skills'}
                                    allowedValues={skillsArray} required/>
                  <MultiSelectField name='tools' placeholder={'Tools'}
                                    allowedValues={toolsArray} required/>
                  <LongTextField name='description' placeholder={'About the team'}/>
                  <Button as={NavLink} exact to={'/'} type='button' onClick={() => {
                    // eslint-disable-next-line no-undef
                    if (window.confirm('Are you sure you wish to create this team?')) {
                      fRef.submit();
                    }
                  }}>
                    Create Team
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

CreateTeam.propTypes = {
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  developer: PropTypes.object.isRequired,
  history: PropTypes.any,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const sub0 = Challenges.subscribe();
  const sub1 = Skills.subscribe();
  const sub2 = Tools.subscribe();
  const sub3 = Developers.subscribe();
  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developer: Developers.findOne(match.params._id),
    ready: sub0.ready() && sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(CreateTeam);
