"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('ember-logintest/adapters/application', ['exports', 'ember-data', 'ember-simple-auth/mixins/data-adapter-mixin'], function (exports, DS, DataAdapterMixin) {

    'use strict';

    exports['default'] = DS['default'].RESTAdapter.extend(DataAdapterMixin['default'], {
        authorizer: 'authorizer:jwt',
        namespace: 'api'
    });

});
define('ember-logintest/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'ember-logintest/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('ember-logintest/authenticators/jwt', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, Ember, Base) {

    'use strict';

    exports['default'] = Base['default'].extend({

        serverTokenEndpoint: '/api/login_check',

        restore: function restore(data) {
            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
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
        authenticate: function authenticate(options) {
            var _this = this;

            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                // Check that both identification and password were given
                if (Ember['default'].isEmpty(options.identification) || Ember['default'].isEmpty(options.password)) {
                    reject('Username and Password are required!');
                }

                var data = { '_username': options.identification, '_password': options.password };
                var serverTokenEndpoint = _this.get('serverTokenEndpoint');

                _this.makeRequest(serverTokenEndpoint, data).then(function (response) {
                    Ember['default'].run(function () {
                        // Check for error
                        resolve(response);
                    });
                }, function (xhr) {
                    Ember['default'].run(function () {
                        reject(xhr.responseJSON.message);
                    });
                });
            });
        },

        invalidate: function invalidate(data) {
            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
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
        makeRequest: function makeRequest(url, data) {
            var options = {
                url: url,
                data: data,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded'
            };

            return Ember['default'].$.ajax(options);
        }
    });

});
define('ember-logintest/authorizers/jwt', ['exports', 'ember', 'ember-simple-auth/authorizers/base'], function (exports, Ember, Base) {

    'use strict';

    exports['default'] = Base['default'].extend({
        authorize: function authorize(sessionData, block) {
            var accessToken = sessionData['token'];
            if (!Ember['default'].isEmpty(accessToken)) {
                block('Authorization', 'Bearer ' + accessToken);
            }
        }
    });

});
define('ember-logintest/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'ember-logintest/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('ember-logintest/controllers/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        session: Ember['default'].inject.service('session'),

        actions: {
            logout: function logout() {
                this.get('session').invalidate().then(function () {}, function () {});
            }
        }
    });

});
define('ember-logintest/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('ember-logintest/controllers/login', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        session: Ember['default'].inject.service('session'),

        actions: {
            authenticate: function authenticate() {
                var _this = this;

                var credentials = this.getProperties('identification', 'password');
                var authenticator = 'authenticator:jwt';

                this.get('session').authenticate(authenticator, credentials)['catch'](function (reason) {
                    _this.set('errorMessage', reason);
                });
            }
        }
    });

});
define('ember-logintest/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('ember-logintest/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ember-logintest/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('ember-logintest/initializers/ember-simple-auth', ['exports', 'ember', 'ember-logintest/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, Ember, ENV, Configuration, setupSession, setupSessionService) {

  'use strict';

  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = ENV['default']['ember-simple-auth'] || {};
      config.baseURL = ENV['default'].baseURL;
      Configuration['default'].load(config);

      setupSession['default'](registry);
      setupSessionService['default'](registry);
    }
  };

});
define('ember-logintest/initializers/export-application-global', ['exports', 'ember', 'ember-logintest/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('ember-logintest/initializers/jwt-auth', ['exports', 'ember-logintest/authenticators/jwt', 'ember-logintest/authorizers/jwt', 'ember-logintest/config/environment'], function (exports, JWTAuthenticator, JWTAuthorizer, ENV) {

    'use strict';

    exports['default'] = {
        name: "jwt-auth",
        before: "ember-simple-auth",

        initialize: function initialize(container, application) {
            container.register('authenticator:jwt', JWTAuthenticator['default']);
            container.register('authorizer:jwt', JWTAuthorizer['default']);
        }
    };

});
define('ember-logintest/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, setupSessionRestoration) {

  'use strict';

  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      setupSessionRestoration['default'](instance);
    }
  };

});
define('ember-logintest/models/profile', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var attr = DS['default'].attr;

    exports['default'] = DS['default'].Model.extend({
        username: attr(),
        email: attr()
    });

});
define('ember-logintest/router', ['exports', 'ember', 'ember-logintest/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    Router.map(function () {
        this.route('login');
        this.route('profile');
    });

    exports['default'] = Router;

});
define('ember-logintest/routes/application', ['exports', 'ember', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, Ember, ApplicationRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default']);

});
define('ember-logintest/routes/profile', ['exports', 'ember', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
        model: function model() {
            return this.store.findAll('profile');
        }
    });

});
define('ember-logintest/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, SessionService) {

	'use strict';

	exports['default'] = SessionService['default'];

});
define('ember-logintest/services/user-session', ['exports'], function (exports) {

   'use strict';

   exports['default'] = Ember.Service.extend({
      isAuthenticated: false,

      login: function login(username, password) {
         var _this = this;

         return new Promise(function (resolve, reject) {
            if (userName === 'test' && password === 'test') {
               //get user from somewhere
               _this.set('isAuthenticated', true);
               resolve();
            } else {
               reject("Username and password did not match");
            }
         });
      }
   });

});
define('ember-logintest/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, Adaptive) {

	'use strict';

	exports['default'] = Adaptive['default'].extend();

});
define('ember-logintest/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 16
            },
            "end": {
              "line": 5,
              "column": 61
            }
          },
          "moduleName": "ember-logintest/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Test");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 24
              },
              "end": {
                "line": 9,
                "column": 53
              }
            },
            "moduleName": "ember-logintest/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Profile");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 16
            },
            "end": {
              "line": 10,
              "column": 16
            }
          },
          "moduleName": "ember-logintest/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          return morphs;
        },
        statements: [
          ["block","link-to",["profile"],[],0,null,["loc",[null,[9,24],[9,65]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 20
            },
            "end": {
              "line": 16,
              "column": 20
            }
          },
          "moduleName": "ember-logintest/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-link navbar-btn");
          var el2 = dom.createTextNode("Logout");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["logout"],[],["loc",[null,[15,78],[15,97]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 24
              },
              "end": {
                "line": 17,
                "column": 49
              }
            },
            "moduleName": "ember-logintest/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Login");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 20
            },
            "end": {
              "line": 18,
              "column": 20
            }
          },
          "moduleName": "ember-logintest/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["login"],[],0,null,["loc",[null,[17,24],[17,61]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "ember-logintest/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","wrapper");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"class","navbar navbar-default navbar-static-top");
        dom.setAttribute(el2,"role","navigation");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","container-fluid");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","navbar-header");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav navbar-right");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0, 1, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [5, 1]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],["class","navbar-brand"],0,null,["loc",[null,[5,16],[5,73]]]],
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[8,22],[8,45]]]]],[],1,null,["loc",[null,[8,16],[10,23]]]],
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[14,26],[14,49]]]]],[],2,3,["loc",[null,[14,20],[18,27]]]],
        ["content","outlet",["loc",[null,[26,4],[26,14]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('ember-logintest/templates/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 16
            },
            "end": {
              "line": 8,
              "column": 16
            }
          },
          "moduleName": "ember-logintest/templates/login.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-danger");
          dom.setAttribute(el1,"role","alert");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          return morphs;
        },
        statements: [
          ["content","errorMessage",["loc",[null,[7,65],[7,83]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "ember-logintest/templates/login.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-6 col-md-offset-3");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        var el6 = dom.createTextNode("Login");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","form-group");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        dom.setAttribute(el6,"for","identification");
        var el7 = dom.createTextNode("Username");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","form-group");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        dom.setAttribute(el6,"for","password");
        var el7 = dom.createTextNode("Password");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","btn btn-primary btn-block");
        dom.setAttribute(el5,"type","submit");
        var el6 = dom.createTextNode("Login");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 1, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createMorphAt(element0,3,3);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]),3,3);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]),3,3);
        return morphs;
      },
      statements: [
        ["element","action",["authenticate"],["on","submit"],["loc",[null,[4,18],[4,55]]]],
        ["block","if",[["get","errorMessage",["loc",[null,[6,22],[6,34]]]]],[],0,null,["loc",[null,[6,16],[8,23]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","identification",["loc",[null,[11,34],[11,48]]]]],[],[]],"id","identification","class","form-control","placeholder","Username","required","required"],["loc",[null,[11,20],[11,134]]]],
        ["inline","input",[],["type","password","value",["subexpr","@mut",[["get","password",["loc",[null,[15,50],[15,58]]]]],[],[]],"id","password","class","form-control","placeholder","Password","required","required"],["loc",[null,[15,20],[15,138]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('ember-logintest/templates/profile', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 18,
              "column": 0
            }
          },
          "moduleName": "ember-logintest/templates/profile.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","row");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","col-md-5 col-md-offset-1");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("table");
          dom.setAttribute(el3,"class","table table-condensed");
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("tr");
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("th");
          var el6 = dom.createTextNode("Username: ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("td");
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("tr");
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("th");
          var el6 = dom.createTextNode("Email: ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("td");
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3]),0,0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 3]),0,0);
          return morphs;
        },
        statements: [
          ["content","username",["loc",[null,[9,24],[9,38]]]],
          ["content","email",["loc",[null,[13,24],[13,35]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "ember-logintest/templates/profile.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Profile");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model",["loc",[null,[3,8],[3,13]]]],["get","as",["loc",[null,[3,14],[3,16]]]],["get","profile",["loc",[null,[3,17],[3,24]]]]],[],0,null,["loc",[null,[3,0],[18,9]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('ember-logintest/tests/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/authenticators/jwt.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authenticators');
  QUnit.test('authenticators/jwt.js should pass jshint', function(assert) { 
    assert.ok(false, 'authenticators/jwt.js should pass jshint.\nauthenticators/jwt.js: line 9, col 49, \'reject\' is defined but never used.\nauthenticators/jwt.js: line 46, col 16, \'data\' is defined but never used.\nauthenticators/jwt.js: line 47, col 49, \'reject\' is defined but never used.\n\n3 errors'); 
  });

});
define('ember-logintest/tests/authorizers/jwt.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authorizers');
  QUnit.test('authorizers/jwt.js should pass jshint', function(assert) { 
    assert.ok(true, 'authorizers/jwt.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/controllers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/controllers/login.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/login.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/login.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, Test) {

  'use strict';

  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, Test['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  ;

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  ;

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }

  ;

});
define('ember-logintest/tests/helpers/resolver', ['exports', 'ember/resolver', 'ember-logintest/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('ember-logintest/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/helpers/start-app', ['exports', 'ember', 'ember-logintest/app', 'ember-logintest/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('ember-logintest/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/initializers/jwt-auth.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/jwt-auth.js should pass jshint', function(assert) { 
    assert.ok(false, 'initializers/jwt-auth.js should pass jshint.\ninitializers/jwt-auth.js: line 3, col 8, \'ENV\' is defined but never used.\ninitializers/jwt-auth.js: line 9, col 37, \'application\' is defined but never used.\n\n2 errors'); 
  });

});
define('ember-logintest/tests/models/profile.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/profile.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/profile.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/routes/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/routes/profile.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/profile.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/profile.js should pass jshint.'); 
  });

});
define('ember-logintest/tests/services/user-session.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/user-session.js should pass jshint', function(assert) { 
    assert.ok(false, 'services/user-session.js should pass jshint.\nservices/user-session.js: line 8, col 45, Missing semicolon.\nservices/user-session.js: line 9, col 21, Missing semicolon.\nservices/user-session.js: line 11, col 57, Missing semicolon.\nservices/user-session.js: line 13, col 9, Missing semicolon.\nservices/user-session.js: line 1, col 16, \'Ember\' is not defined.\nservices/user-session.js: line 5, col 20, \'Promise\' is not defined.\nservices/user-session.js: line 6, col 13, \'userName\' is not defined.\n\n7 errors'); 
  });

});
define('ember-logintest/tests/test-helper', ['ember-logintest/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('ember-logintest/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('ember-logintest/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-logintest';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("ember-logintest/tests/test-helper");
} else {
  require("ember-logintest/app")["default"].create({"name":"ember-logintest","version":"0.0.0+"});
}

/* jshint ignore:end */
//# sourceMappingURL=ember-logintest.map