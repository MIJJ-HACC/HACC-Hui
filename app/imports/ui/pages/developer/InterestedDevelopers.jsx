import { Meteor } from 'meteor/meteor';
import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListInterestedDevelopersWidget from '../../components/developer/ListInterestedDevelopersWidget';

class InterestedDevelopers extends React.Component {
  render() {
    return (
        <ListInterestedDevelopersWidget/>
    );
  }
}

export default withAllSubscriptions(InterestedDevelopers);
