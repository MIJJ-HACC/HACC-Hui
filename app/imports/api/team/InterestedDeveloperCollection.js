import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from '../user/DeveloperCollection';
import { Teams } from './TeamCollection';
import { ROLE } from '../role/Role';


/**
 * Collection of team-developer pairs for interested developers.
 * @extends api/base.BaseCollection
 * @memberOf api/team
 */
class InterestedDeveloperCollection extends BaseCollection {
  constructor() {
    super('InterestedDevs', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Creates a team-developer pair.
   * @param team {String} team slug or ID.
   * @param developer {String} developer slug or ID.
   * @return {String} the ID of the pair.
   */
  define({ team, developer }) {
    const teamID = Teams.getID(team);
    const developerID = Developers.getID(developer);
    return this._collection.insert({ teamID, developerID });
  }

  /**
   * Updates the given team-developer pair.
   * @param docID {String} the ID of the pair to update.
   * @param team {String} the slug or ID of the team (optional).
   * @param developer {String} the slug or ID of the developer (optional).
   * @throws {Meteor.Error} if docID is undefined.
   */
  update(docID, { team, developer }) {
    this.assertDefined(docID);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
    }
    if (team) {
      updateData.teamID = Teams.getID(team);
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the developer-team pair.
   * @param docID {String} the ID to remove.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the pairs with the given developer.
   * @param developer {String} the slug or ID of the developer.
   * @throws {Meteor.Error} if the developer is undefined.
   */
  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  /**
   * Removes all the pairs with the given team.
   * @param team {String} the slug or ID for the team.
   * @throws {Meteor.Error} if the team is undefined.
   */
  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

/**
 * Singleton instance of the InterestedDeveloperCollection.
 * @type {api/team.InterestedDeveloperCollection}
 * @memberOf api/team
 */
export const InterestedDevs = new InterestedDeveloperCollection();