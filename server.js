var Hapi = require('hapi');
var Path = require('path');
//var rethinkdb = require('rethinkdb');
//var requests = require('requests');
//var fsm = require('javascript-state-machine');

var device_routes = require('./src/routes/device');
var site_routes = require('./src/routes/site');

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '.')
            }
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
