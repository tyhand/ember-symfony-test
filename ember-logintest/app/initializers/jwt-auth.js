import JWTAuthenticator from 'ember-logintest/authenticators/jwt';
import JWTAuthorizer from 'ember-logintest/authorizers/jwt';
import ENV from 'ember-logintest/config/environment';

export default {
    name: "jwt-auth",
    before: "ember-simple-auth",

    initialize: function(container, application) {
        container.register('authenticator:jwt', JWTAuthenticator);
        container.register('authorizer:jwt', JWTAuthorizer);
    }
};
