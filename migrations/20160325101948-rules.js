exports.up = function (r, connection) {
    return r.tableCreate('rules').run(connection)
};

exports.down = function (r, connection) {
    return r.tableDrop('rules').run(connection);
};
