exports.up = function (r, connection) {
    return r.tableCreate('users').run(connection)
};

exports.down = function (r, connection) {
    return r.tableDrop('users').run(connection);
};
