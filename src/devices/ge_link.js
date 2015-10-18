var shema = require('js-schema');

module.exports = {
        type: 'ge_link',
        name: 'bedroom_lamp',
        last_updated: 'Sun Oct 18 2015 04:19:14 GMT+00:00',
        state: {
            power: false,
            brightness: 1.0
        },
        schema: schema({
            power: Boolean,
            brightness: Number.min(0).max(1)
        })
};
