var shema = require('js-schema');
var uuid = require('node-uuid');

var userSchema = schema({
    name: String.of('a-zA-z '),
    email: String
})

module.exports = [
    {
        /* Return a list of all users */
        method: 'GET',
        path: '/users',
        handler: function(request, reply) {

            var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
            var localhost = request.server.plugins['hapi-rethinkdb'].connection;

            r.table('users')
            .run(localhost, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    reply(JSON.stringify(result, null, 2));
                });
            });

        }
    },
    {
        /* Return a specific user */
        method: 'GET',
        path: '/users/{id}',
        handler: function (request, reply) {

            var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
            var localhost = request.server.plugins['hapi-rethinkdb'].connection

            r.table('users')
            .get(request.params.id)
            .run(localhost, function(err, cursor) {
                if (err) reply(err);

                if (cursor) {
                    reply(cursor);
                } else {
                    reply("Not Found").code(404);
                }

            });

        }
    },
    {
        /* Create a user */
        method: 'POST',
        path: '/users',
        handler: function (request, reply) {

            var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
            var localhost = request.server.plugins['hapi-rethinkdb'].connection

            // Return bad request if payload doesn't validate
            if (!userSchema(request.payload)) {
                reply("Bad Payload").code(400);
                return;
            }

            user = request.payload;
            user.key = uuid.v4();

            r.table('users')
            .insert(request.payload)
            .run(localhost, function(err, cursor) {
                if (err) reply(err);
                reply(cursor);
            });

        }
    },
    {
        /* edit a user */
        method: 'PUT',
        path: '/users/{id}',
        handler: function (request, reply) {

            var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
            var localhost = request.server.plugins['hapi-rethinkdb'].connection

            // Return bad request if payload doesn't validate
            if (!userSchema(request.payload)) {
                reply("Bad Payload").code(400);
                return;
            }

            r.table('users')
            .get(request.params.id)
            .update(request.payload)
            .run(localhost, function(err, cursor) {
                if (err) reply(err);
                reply(cursor);
            });

        }
    },
    {
        /* delete a user */
        method: 'DELETE',
        path: '/users/{id}',
        handler: function (request, reply) {

            var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
            var localhost = request.server.plugins['hapi-rethinkdb'].connection


            console.log(request.params.id)
            r.table('users')
            .get(request.params.id)
            .delete()
            .run(localhost, function(err, cursor) {
                if (err) reply(err);
                reply(cursor);
            });

        }
    }
];
