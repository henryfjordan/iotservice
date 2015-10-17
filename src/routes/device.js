var devices = require('../devices');

module.exports = [
    {
        method: 'GET',
        path: '/device',
        handler: function (request, reply) {
            reply(devices);
        }
    },
    {
        method: 'GET',
        path: '/device/{type}',
        handler: function (request, reply) {
            var device = devices[request.params.type]
            if (device) {
                reply(device)
            } else {
                reply("Device Not Found").code(404)
            }
        }
    },
    {
        method: 'GET',
        path: '/device/{type}/{name}',
        handler: function (request, reply) {
            var device = devices[request.params.type].find(function(obj) {
                return obj.name == request.params.name
            });
            if (device) {
                reply(device)
            } else {
                reply("Device Not Found").code(404)
            }
        }
    },
    {
        method: 'POST',
        path: '/device/{device}',
        handler: function (request, reply) {
            reply('Hello, post!');
        }
    }
];
