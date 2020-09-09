import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Developers } from './DeveloperCollection';

/**
 * Meteor method for updating a given stuff instance.
 * @param updateData {Object} an Object with .id and the update data.
 * @type {ValidatedMethod}
 * @memberOf api/stuff
 */
export const developerUpdateMethod = new ValidatedMethod({
  name: 'DeveloperCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run(updateData) {
    Developers.update(updateData.id, updateData);
    return true;
  },
});
