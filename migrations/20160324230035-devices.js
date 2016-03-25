exports.up = function (r, connection) {
    return r.tableCreate('devices').run(connection)
};

exports.down = function (r, connection) {
    return r.tableDrop('devices').run(connection);
};
