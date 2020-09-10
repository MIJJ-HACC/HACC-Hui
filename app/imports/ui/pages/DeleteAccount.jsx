import React from 'react';
import SimpleSchema from 'simpl-schema';
import { Grid, Header, Segment, Button, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, LongTextField, SelectField } from 'uniforms-semantic';
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

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data) {
    const username = this.props.doc.username;
    const type = userInteractionTypes.deletedAccount;
    const typeData = [];
    typeData.push(data.reason);
    typeData.push(data.other);
    const userInteraction = {
      username,
      type,
      typeData,
    };
    userInteractionDefineMethod.call(userInteraction);
    removeItMethod.call({ collectionName: Developers.getCollectionName(), instance: this.props.doc._id }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Account deleted successfully.', 'success');
        // eslint-disable-next-line react/prop-types
        this.props.history.push('/signout', { some: 'state' });
      }
    });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

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
    let fRef = null;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Why do you want to delete your HACC Hui account?</Header>
            <AutoForm ref={ref => { fRef = ref; }}
                      schema={formSchema}
                      onSubmit={data => this.submit(data)}>
              <Segment>
                <SelectField name='reason'/>
                <LongTextField name='other'/>
                <Button type='button' onClick={() => {
                  // eslint-disable-next-line no-undef
                  if (window.confirm('Are you sure you wish to delete your account?')) {
                    fRef.submit();
                  }
                }} color='red'>
                  Delete Account
                </Button>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/**
 * Require the presence of a DeleteAccount document in the props object.
 */
DeleteAccount.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.any,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Developers documents.
  const subscription = Developers.subscribe();
  return {
    doc: Developers.findOne(documentId),
    ready: subscription.ready(),
  };
})(DeleteAccount);
