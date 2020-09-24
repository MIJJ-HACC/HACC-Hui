import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Grid, Header, Container } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import ListInterestedDeveloperExampleWidget from './ListInterestedDevelopersExampleWidget';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { DeveloperTools } from '../../../api/user/DeveloperToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { InterestedDevs } from '../../../api/team/InterestedDeveloperCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { Teams } from '../../../api/team/TeamCollection';

const getDeveloperChallenges = (interestedDevs) => {
  let dID = interestedDevs.developerID;
  const developerList = Developers.find({}).fetch();
  let challengeTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === dID) {
      dID = developerList[key]._id;
      const developerChallengesDocs = DeveloperChallenges.find({ dID }).fetch();
      challengeTitles = developerChallengesDocs.map((tc) => Challenges.findDoc(tc.challengeID).title);
    }
  }
  return challengeTitles;
};

const getDeveloperSkills = (interestedDevs) => {
  let dID = interestedDevs.developerID;
  const developerList = Developers.find({}).fetch();
  let skillTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === dID) {
      dID = developerList[key]._id;
      const developerSkillsDocs = DeveloperSkills.find({ dID }).fetch();
      skillTitles = developerSkillsDocs.map((tc) => Skills.findDoc(tc.skillID).name);
    }
  }
  return skillTitles;
};

const getDeveloperTools = (interestedDevs) => {
  let dID = interestedDevs.developerID;
  const developerList = Developers.find({}).fetch();
  let toolTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === dID) {
      dID = developerList[key]._id;
      const developerToolsDocs = DeveloperTools.find({ dID }).fetch();
      toolTitles = developerToolsDocs.map((tc) => Tools.findDoc(tc.toolID).name);
    }
  }
  return toolTitles;
};


class ListInterestedDevelopersWidget extends React.Component {

  render() {
    const runningDevs = this.props.developers;
    function getInterestedDevelopers(devs) {
      const data = [];
      for (let i = 0; i < devs.length; i++) {
        for (let k = 0; k < runningDevs.length; k++) {
          if (devs[i].developerID === runningDevs[k]._id) {
            data.push(runningDevs[k]);
          }
        }
      }
      return data;
    }
    return (
        <Grid celled>
          <Grid.Row columns={5}>
            <Grid.Column>
              <Header>Name</Header>
            </Grid.Column>
			<Grid.Column>
              <Header>Username</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Challenges</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Skills</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Tools</Header>
            </Grid.Column>
          </Grid.Row>
          {getInterestedDevelopers(this.props.interestedDevs)
                .map((developers) => (
                    <ListInterestedDeveloperExampleWidget
                        key={developers._id}
                        developer={developers}
						developerChallenges={getDeveloperChallenges(developers)}
                        developerSkills={getDeveloperSkills(developers)}
                        developerTools={getDeveloperTools(developers)}
                    />
                ))}
        </Grid>
    );
  }
}

ListInterestedDevelopersWidget.propTypes = {
  developers: PropTypes.array.isRequired,
  interestedDevs: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const interestedDevs = InterestedDevs.find({}).fetch();
  const developers = Developers.find({}).fetch();
  return {
    interestedDevs,
    developers,

  };
})(ListInterestedDevelopersWidget);