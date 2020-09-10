import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Developers } from '../../api/user/DeveloperCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

/**
 * A simple page to agree to the terms.
 * @memberOf ui/pages
 */
class Participation extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(_id) {
    const updateData = {
      id: _id,
      isCompliant: true,
    };
    updateMethod.call({collectionName: Developers.getCollectionName() , updateData: updateData});
  }

  render() {
    const { isCompliant, _id } = Developers.findOne();
    return isCompliant ?
      (<Redirect exact to={{ pathname: '/' }}/>) :
      (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={8}>
            <h1>Participation Form</h1>
            <p>Terms and Conditions...</p>
            <Button as={NavLink} exact to={`/editProfile/${_id}`} onClick={() => this.submit(_id)} content="I agree" />
          </Grid.Column>

        </Grid>
      );
  }
}

export default Participation;
