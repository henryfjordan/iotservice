var r = require('rethinkdb');
var shema = require('js-schema');

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

var ge_link_state = schema({
    power: Boolean,

});

module.exports = [
    {
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
        method: 'POST',
        path: '/device/{device}/{name}',
        handler: function (request, reply) {

            console.log(request.payload);

            if(!ge_link_state(request.payload)) {
                reply(request.payload + "dup\n");
                return;
            }

            r.table('devices')
            .filter({name: request.params.name})
            .update({scope: request.payload})
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
    }
];
