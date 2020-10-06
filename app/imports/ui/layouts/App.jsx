import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import ListStuff from '../pages/ListStuff';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddStuff from '../pages/AddStuff';
import AddChallenge from '../pages/AddChallenge';
import AddSkill from '../pages/AddSkill';
import AddTool from '../pages/AddTool';
import EditStuff from '../pages/EditStuff';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signout from '../pages/Signout';
import ConfigureHACC from '../pages/ConfigureHACC';
import withAllSubscriptions from './AllSubscriptionsHOC';
import { ROLE } from '../../api/role/Role';
import AgePage from '../pages/developer/AgePage';
import ParticipationForm from '../pages/developer/ParticipationForm';
import UnderParticipationForm from '../pages/developer/UnderParticipationForm';
import Dprofile from '../pages/developer/Dprofile';
import TeamCreation from '../pages/developer/TeamCreation';
import TeamFinder from '../pages/developer/TeamFinder';
import { ROUTES } from '../../startup/client/route-constants';
import DeleteForm from '../pages/developer/DeleteForm';
// import UpdateTeamPage from '../pages/developer/UpdateTeamPage';
import UpdateTeamWidget from '../components/developer/UpdateTeamWidget';
import DumpDatabase from '../pages/administrator/DumpDatabase';
import EditProfilePage from '../pages/developer/EditProfilePage';
import ListTeamsPage from '../pages/developer/ListTeamsPage';
import InterestedDevelopers from '../pages/developer/InterestedDevelopers';
import DirectInvite from '../components/developer/DirectInvite';  // changed

/**
 * Top-level layout component for this application. Called in imports/startup/client/startup.jsx.
 * @memberOf ui/layouts
 */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <NavBar />
            <Switch>
              <Route exact path={ROUTES.LANDING} component={Landing} />
              <Route path={ROUTES.SIGN_IN} component={Signin} />
              <ProtectedRoute path={ROUTES.AGE_CONSENT} component={AgePage} />
              <ProtectedRoute path={ROUTES.PARTICIPATION} component={ParticipationForm} />
              <ProtectedRoute path={ROUTES.UNDERAGE_PARTICIPATION} component={UnderParticipationForm} />
              <ProtectedRoute path={ROUTES.CREATE_PROFILE} component={Dprofile} />
              <ProtectedRoute path={ROUTES.EDIT_PROFILE} component={EditProfilePage} />
              <ProtectedRoute path={ROUTES.CREATE_TEAM} component={TeamCreation} />
              <ProtectedRoute path={ROUTES.FIND_TEAM} component={TeamFinder} />
              <ProtectedRoute path={ROUTES.LIST_TEAMS} component={ListTeamsPage} />
              <ProtectedRoute path={ROUTES.DELETE_ACCOUNT} component={DeleteForm} />
              <ProtectedRoute path="/list" component={ListStuff} />
              <ProtectedRoute path="/add" component={AddStuff} />
              <ProtectedRoute path="/edit/:_id" component={EditStuff} />
              <ProtectedRoute path={`${ROUTES.DIRECT_INVITE}/:_id`} component={DirectInvite} /> {/*changed*/}
              <AdminProtectedRoute path="/admin" component={ListStuffAdmin} />
              <AdminProtectedRoute path={ROUTES.CONFIGURE_HACC} component={ConfigureHACC} />
              <AdminProtectedRoute path={ROUTES.ADD_CHALLENGE} component={AddChallenge} />
              <AdminProtectedRoute path={ROUTES.ADD_SKILL} component={AddSkill} />
              <AdminProtectedRoute path={ROUTES.ADD_TOOL} component={AddTool} />
              <ProtectedRoute path={`${ROUTES.UPDATE_TEAM}/:_id`} component={UpdateTeamWidget} />
              <AdminProtectedRoute path={ROUTES.DUMP_DATABASE} component={DumpDatabase} />
              <ProtectedRoute path={ROUTES.SIGN_OUT} component={Signout} />
              <ProtectedRoute path={ROUTES.INTERESTED_DEVELOPERS} component={InterestedDevelopers} />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 * @memberOf ui/layouts
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withAllSubscriptions(Component);
  return (
      <Route
          {...rest}
          render={(props) => {
            const isLogged = Meteor.userId() !== null;
            return isLogged ?
                (<WrappedComponent {...props} />) :
                (<Redirect to={{ pathname: ROUTES.SIGN_IN, state: { from: props.location } }} />
                );
          }}
      />
  );
};

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 * @memberOf ui/layouts
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withAllSubscriptions(Component);
  return (
      <Route
          {...rest}
          render={(props) => {
            const isLogged = Meteor.userId() !== null;
            const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
            return (isLogged && isAdmin) ?
                (<WrappedComponent {...props} />) :
                (<Redirect to={{ pathname: ROUTES.SIGN_IN, state: { from: props.location } }} />
                );
          }}
      />
  );
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]),
  location: PropTypes.object,
};

export default App;
