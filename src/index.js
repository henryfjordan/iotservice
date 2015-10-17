var Hapi = require('hapi');
var Path = require('path');
//var rethinkdb = require('rethinkdb');
//var requests = require('requests');
//var fsm = require('javascript-state-machine');

var routes = require('./routes/device');

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'static')
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
        handler: function (request, reply) {
            reply.file('html/index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/build/{file}',
        handler: function (request, reply) {
            reply.file('build/' + request.params.file);
        }
    });


});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
