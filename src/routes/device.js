var r = require('rethinkdb');
var shema = require('js-schema');

// Get list of devices
var devices = require('../devices');

// Connect to the DB on import
var localhost = null;
r.connect(
    {
        host: 'localhost',
        port: 28015,
        db: 'iot'
    },
    function(err, conn) {
        if (err) throw err;
        localhost = conn;
    }
)

module.exports = [
    {
        /* Return a list of all devices */
        method: 'GET',
        path: '/device',
        handler: function(request, reply) {

            r.table('devices')
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
        /* Return a list of all devices of a type */
        method: 'GET',
        path: '/device/{type}',
        handler: function (request, reply) {

            r.table('devices')
            .filter({type: request.params.type})
            .run(localhost, function(err, cursor) {
                if (err) reply(err);
                cursor.toArray(function(err, result) {
                    if (err) reply(err);
                    reply(JSON.stringify(result, null, 2));
                });
            });

        }
    },
    {
        /* Return a specific device */
        method: 'GET',
        path: '/device/{type}/{name}',
        handler: function (request, reply) {

            r.table('devices')
            .filter({name: request.params.name})
            .run(localhost, function(err, cursor) {
                if (err) reply(err);
                cursor.toArray(function(err, result) {
                    if (err) reply(err);
                    if (result.length > 0 && result[0].type == request.params.type) {
                        reply(JSON.stringify(result, null, 2));
                    } else {
                        reply('device group not found');
                    }

                });
            });

        }
    },
    {
        /* Update a specific device */
        method: 'POST',
        path: '/device/{device}/{name}',
        handler: function (request, reply) {

            // Return bad request if payload doesn't validate
            if(! devices[request.params.device].schema(request.payload)) {
                reply("Bad Payload").code(400);
                return;
            }

            r.table('devices')
            .filter({name: request.params.name})
            .update({
                state: request.payload,
                last_updated: r.now()
            })
            .run(localhost, function(err, cursor) {
                if (err) reply(err);
                reply(cursor);
            });

        }
    }
];
