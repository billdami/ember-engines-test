import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    store: service(),

    beforeModel() {
        this._super(...arguments);
        this.store.createRecord('user', {firstName: 'Bill', lastName: 'D'});
        this.store.createRecord('user', {firstName: 'Adam', lastName: 'Baker'});
        this.store.createRecord('user', {firstName: 'Alan', lastName: 'DiStasio'});
    },

    model() {
        return this.store.peekAll('user');
    }
});
