var Hapi = require('hapi');
var Path = require('path');

var device_routes = require('./app/routes/device');
var user_routes = require('./app/routes/users')
var site_routes = require('./app/routes/site');
var devices = require('./app/devices');

// Hapi Server
var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '.')
            }
        },
        router: {
            stripTrailingSlash: true
        }
    }
});

// Set port number
server.connection({ port: 5050 });

// Register rethinkdb plugin
server.register({
    register: require('hapi-rethinkdb'),
    options: {
        url: 'rethinkdb://localhost:28015/iotservice'
    }
}, function (err) {
    if (err) console.error(err);

    // Register device watchers after DB connection
    for (var device in devices) {
        devices[device]['watcher'](
            server.plugins['hapi-rethinkdb'].rethinkdb,
            server.plugins['hapi-rethinkdb'].connection
        );
    }
})

// Register inert (for static content)
server.register(require('inert'), function (err) {
    if (err) throw err;
    server.route(site_routes);
});

// Validation function for API keys
const validate = function (request, username, password, callback) {

    var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
    var localhost = request.server.plugins['hapi-rethinkdb'].connection;

    var user = r.table('users')
        .get(request.params.id)
        .run(localhost, function(err, cursor) {
            if (err) reply(err);

            if (cursor) {
                reply(cursor);
            } else {
                reply("Not Found").code(404);
            }

    });

    if (!user.key || user.key != password) {
        return callback(null, false);
    }

    callback(err, true, key);
};

// Add device routes
server.register(require('hapi-auth-basic-key'), function (err) {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    server.route(device_routes);
    server.route(user_routes);
});


// Start Server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
