import React from 'react';
import { Grid, Image, Icon, Segment, Button, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Developers } from '../../api/user/DeveloperCollection';

/**
 * A simple profile page showing the users info.
 * @memberOf ui/pages
 */
class Profile extends React.Component {
  render() {
    const { firstName, lastName, demographicLevel, lookingForTeam, challenges,
      skills, tools, linkedIn, gitHub, website, aboutMe, _id } = Developers.findOne();
    return (
        <Grid stackable={true} textAlign='center' container>

          <Grid.Row columns={3}>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
              <h1>{firstName} {lastName}</h1>  
            </Grid.Column>
            <Grid.Column floated='right'>
              <Link to={`/editprofile/${_id}`}>Edit</Link>
              <Icon name='edit' size='big'/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment textAlign='left'>
                <h5><Icon name='linkedin' size='large'/>LinkedIn</h5>
                <p>{linkedIn}</p>
                <h5><Icon name='github' size='large'/>Github</h5>
                <p>{gitHub}</p>
                <h5><Icon name='computer' size='large'/>Website</h5>
                <p>{website}</p>
              </Segment>
              <Segment textAlign='left'>
                <h1>About Me</h1>
                <p>{aboutMe}</p>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment textAlign='left'>
                <h1>Skills</h1>
                <h5>Experienced</h5>
                <List horizontal>
                  <List.Item>
                    <Segment>
                      Javascript
                    </Segment>
                  </List.Item>
                </List>
                <h5>Novice</h5>
                <h5>Willing To Learn</h5>
              </Segment>
              <Segment textAlign='left'>
                <h1>Tools</h1>
                <h5>Experienced</h5>
                <h5>Novice</h5>
                <h5>Willing To Learn</h5>
              </Segment>
              <Segment textAlign='left'>
                <h1>Challenges</h1>
                <p>:P</p>
              </Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Button negative>Delete Account</Button>
          </Grid.Row>

        </Grid>
    );
  }
}

export default Profile;
