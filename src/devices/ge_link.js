var shema = require('js-schema');
var request = require('request');

var TYPE_NAME = 'ge_link'

module.exports = {

    type: TYPE_NAME,

    // Note that these are for example only
    name: 'bedroom_lamp',
    last_updated: 'Sun Oct 18 2015 04:19:14 GMT+00:00',
    state: {
        power: false,
        brightness: 1.0
    },

    // Device state schema definition
    schema: schema({
        power: Boolean,
        brightness: Number.min(0).max(1)
    }),

    // Watcher function
    watcher: function(r, conn) {
        r.table('devices')
        .filter({type: TYPE_NAME})
        .changes().run(conn, function(err, cursor) {
          cursor.each(function(err, row) {
              if (err) throw err;
              console.log(row);
          });
        });
    }
};
