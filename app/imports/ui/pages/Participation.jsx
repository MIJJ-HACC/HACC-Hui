import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Participation extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={8}>
            <h1>Complient Form</h1>
            <p>stuff stuff stuff</p>
            <Button as={NavLink} activeClassName="active" exact to="/profile" content="Lets go" />
          </Grid.Column>

        </Grid>
    );
  }
}

export default Participation;
