var shema = require('js-schema');
var request = require('request');

var TYPE_NAME = 'ge_link'

module.exports = {

    type: TYPE_NAME,

    // Note that these are for example only
    name: 'bedroom_lamp',
    last_updated: 'Sun Oct 18 2015 04:19:14 GMT+00:00',
    state: {
        powered: false,
        brightness: 1.0
    },

    // Device state schema definition
    schema: schema({
        powered: Boolean,
        brightness: Number.min(0).max(1)
    }),

    // Watcher function
    watcher: function(r, conn) {
        r.table('devices')
        .filter({type: TYPE_NAME})
        .changes().run(conn, function(err, cursor) {
          cursor.each(function(err, row) {
              if (err) throw err;

              request({
                  url: "https://winkapi.quirky.com/light_bulbs/871605",
                  body: "{\"desired_state\":" +  JSON.stringify(row['new_val']['state']) + "\n}",
                  headers: {"Content-Type": "application/json", "Authorization": "Bearer c94b6e65f461161b627dd1e8b00cb39a"},
                  method: "PUT"
                }, function (error, response, body) {


                        console.log("Status", response.statusCode);
                        console.log("Headers", JSON.stringify(response.headers));
                        console.log("Response received", body);

                });

            });
        });
    }
};
