import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

    serverTokenEndpoint:  '/api/login_check',

    restore(data) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            resolve(data);
        });
    },

    /**
     * Authenticate user information
     *
     * @param  {Object} options Credentials information
     *
     * @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
     */
    authenticate(options) {
        var _this = this;

        return new Ember.RSVP.Promise((resolve, reject) => {
            // Check that both identification and password were given
            if (Ember.isEmpty(options.identification) || Ember.isEmpty(options.password)) {
                reject('Username and Password are required!');
            }

            const data = { '_username': options.identification, '_password': options.password };
            const serverTokenEndpoint = _this.get('serverTokenEndpoint');

            _this.makeRequest(serverTokenEndpoint, data).then((response) => {
                Ember.run(() => {
                    // Check for error
                    resolve(response);
                });
            }, (xhr) => {
                Ember.run(() => {
                    reject(xhr.responseJSON.message);
                });
            });
        });
    },

    invalidate(data) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            resolve();
        });
    },

    /**
     * Make a request
     *
     * @param  {String} url  [description]
     * @param  {Object} data [description]
     *
     * @return {jQuery.Deferred} A promise like jQuery.Deferred as returned by `$.ajax`
     */
    makeRequest(url, data) {
        const options = {
            url,
            data,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded'
        };

        return Ember.$.ajax(options);
    }
});
