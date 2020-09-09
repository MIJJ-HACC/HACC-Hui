import React from 'react';
import { Grid, Image, Icon, Segment, Button, List } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField, LongTextField, BoolField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import { Developers } from '../../api/user/DeveloperCollection';
import { developerUpdateMethod } from '../../api/user/DeveloperCollection.methods';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class EditProfile extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data) {
    const { firstName, lastName, demographicLevel, lookingForTeam, challenges,
      skills, tools, linkedIn, gitHub, website, aboutMe, _id } = data;
    const updateData = {
      id: _id,
      firstName,
      lastName,
      demographicLevel,
      lookingForTeam,
      challenges,
      skills,
      tools,
      linkedIn,
      gitHub,
      website,
      aboutMe,
    };
    developerUpdateMethod.call(updateData, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  render() {
    const formSchema = new SimpleSchema2Bridge(Developers.getSchema());
    const dev = Developers.findOne();
    return (
        <Grid stackable={true} textAlign='center' container>

          <Grid.Row columns={1}>
            <Grid.Column>
              <h1>Edit Your Profile</h1>  
            </Grid.Column>
            <Grid.Column floated='right'>
              <h1>back</h1>  
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={1}>
            <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={dev}>
              <Segment>
                <SelectField name='demographicLevel'/>
                <BoolField name='lookingForTeam'/>
                <TextField name='linkedIn' placeholder='linkedin url...'/>
                <TextField name='gitHub' placeholder='github url...'/>
                <TextField name='website' placeholder='website url...'/>
                <LongTextField name='aboutMe' placeholder='a short bio about yourself...'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment textAlign='left'>
                <h1>First Name</h1>
                <h1>Last Name</h1>
              </Segment>
              <Segment textAlign='left'>
                <h5><Icon name='linkedin' size='large'/>LinkedIn</h5>
                <p>optional</p>
                <h5><Icon name='github' size='large'/>Github</h5>
                <p>optional</p>
                <h5><Icon name='computer' size='large'/>Website</h5>
                <p>optional</p>
              </Segment>
              <Segment textAlign='left'>
                <h1>About Me</h1>
                <p>optional, 200 char</p>
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
            <Button color='green'>Save Changes</Button>
            <Button>Cancel</Button>
          </Grid.Row>

        </Grid>
    );
  }
}

export default EditProfile;
