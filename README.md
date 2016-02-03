# Ember.js and Symfony Login Test
A small test application to toy with using Ember.js with a Symfony project and to experiment with using Json Web Tokens.

## Installation
Start by cloning the repository from github.
```bash
$ git clone git@github:tyhand/ember-symfony-test.git
```

Since this project uses Json web tokens, you'll need to generate a private and public key.  To generate the keys:
```bash
$ mkdir -p app/var/jwt
$ openssl genrsa -out app/var/jwt/private.pem -aes256 4096
$ openssl rsa -pubout -in app/var/jwt/private.pem -out app/var/jwt/public.pem
```

Note that if you are using apache, you'll have to set it to use the http authorization header.  More instructions on the Json Web Token Authentication can be found at [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle).

Then install the dependencies with composer, and add the required fields to the parameters.yml file.
```bash
$ composer install
```

Afterwards, create a database for the application to use and run the doctrine schema update command to setup the schema.
```bash
$ app/console doctrine:schema:update --dump-sql
```
Check that the output is what is expected (should just be creating user tables).  If it is, apply the changes.
```bash
$ app/console doctrine:schema:update --force
```

With the database ready, let's create a user.
```bash
$ app/console mesd-user:user:create
```

Then go ahead and setup the ember.js frontend part, first by installing the npm and bower dependencies.
```bash
$ cd ember-logintest
$ npm install
$ bower install
```

Next, build the ember project.
```bash
$ ember build
```

Finally, with all that in place, you should be able to run the project.
```bash
$ app/console server:run
```

Goto to the page and see a working login screen if everything went well.

## License
This project is under the [MIT License](LICENSE)
