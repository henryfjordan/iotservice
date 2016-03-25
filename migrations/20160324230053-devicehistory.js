exports.up = function (r, connection) {
    return r.tableCreate('devicehistory').run(connection)
};

exports.down = function (r, connection) {
    return r.tableDrop('devicehistory').run(connection);
};
