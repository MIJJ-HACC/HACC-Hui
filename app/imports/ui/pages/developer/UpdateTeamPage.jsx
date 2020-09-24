import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import UpdateTeamWidget from '../../components/developer/UpdateTeamWidget';

class UpdateTeamPage extends React.Component {
  render() {
    return (
        <UpdateTeamWidget />
    );
  }
}

export default withAllSubscriptions(UpdateTeamPage);
