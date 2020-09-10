import React from 'react';
import { Table } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Challenges } from '../../api/challenge/ChallengeCollection';

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ChallengesAdmin extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.challenges.title}</Table.Cell>
          <Table.Cell>{this.props.challenges.description}</Table.Cell>
		  <Table.Cell>{this.props.challenges.submissionDetail}</Table.Cell>
          <Table.Cell>{this.props.challenges.pitch}</Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ChallengesAdmin.propTypes = {
  challenges: PropTypes.object.isRequired,
};

export default withRouter(ChallengesAdmin);
