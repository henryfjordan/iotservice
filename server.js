var Hapi = require('hapi');
var Path = require('path');

var device_routes = require('./src/routes/device');
var site_routes = require('./src/routes/site');
var devices = require('./src/devices');


/* Device watchers */
var rethinkdb = require('rethinkdb');
rethinkdb.connect(
    {
        host: 'localhost',
        port: 28015,
        db: 'iot'
    },
    function(err, conn) {
        if (err) throw err;
        for (var device in devices) {
            devices[device]['watcher'](rethinkdb, conn);
        }
    }
)


/* Hapi Server */
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
server.connection({ port: 5050 });

server.route(device_routes);

server.register(require('inert'), function (err) {
    if (err) throw err;
    server.route(site_routes);
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
