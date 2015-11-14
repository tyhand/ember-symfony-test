import Ember from 'ember';
import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(sessionData, block) {
        const accessToken = sessionData['token'];
        if (!Ember.isEmpty(accessToken)) {
            block('Authorization', `Bearer ${accessToken}`);
        }
    }
});
