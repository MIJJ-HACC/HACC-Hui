import { Meteor } from 'meteor/meteor';
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { Grid, Header, Segment, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, SelectField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Developers } from '../../api/user/DeveloperCollection';
import { userInteractionDefineMethod } from '../../api/user/UserInteractionCollection.methods';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { userInteractionTypes } from '../../api/user/UserInteractionCollection';

/**
 * After the user clicks the "Delete Account" link in the NavBar, display this page then delete the account when
 *  submitted.
 * @memberOf ui/pages
 */
class DeleteAccount extends React.Component {

  submit(data) {
    const username = this.props.doc.username;
    const type = userInteractionTypes.deleteAccount;
    const typeData = [];
    typeData.push(data.reason);
    typeData.push(data.other);
    const userInteraction = {
      username,
      type,
      typeData,
    }
    userInteractionDefineMethod.call(userInteraction);
    const instance = this.props.doc._id;
    removeItMethod.call({ Developers, instance });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const reasons = ['No challenge was interesting', 'Couldn\'t find a team I like being on', 'etc'];
    const schema = new SimpleSchema({
      reason: {
        type: String,
        allowedValues: reasons,
        defaultValue: 'etc',
      },
      other: {
        type: String,
      },
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Why do you want to delete your HACC Hui account?</Header>
            <AutoForm schema={formSchema} onSubmit={data => {
              // eslint-disable-next-line
              if (window.confirm('Are you sure you wish to delete your account?')) this.submit(data);
            } }>
              <Segment>
                <SelectField name='reason'/>
                <LongTextField name = 'other'/>
                <SubmitField value='Delete Account'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/**
 * Require the presence of a DeleteAccount document in the props object. Uniforms adds 'model' to the props, which we
 * use.
 */
DeleteAccount.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Developers');
  return {
    doc: Developers.findOne(documentId),
    ready: subscription.ready(),
  };
})(DeleteAccount);
