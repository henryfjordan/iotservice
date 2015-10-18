var Hapi = require('hapi');
var Path = require('path');
//var rethinkdb = require('rethinkdb');
//var requests = require('requests');
//var fsm = require('javascript-state-machine');

var routes = require('./src/routes/device');

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

server.route(routes);

server.register(require('inert'), function (err) {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: 'src/assets/html/index.html'
        }
    });

    server.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: 'bower_components/'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/assets/{file}',
        handler: {
            directory: {
                path: 'assets/'
            }
        }
    });


});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
