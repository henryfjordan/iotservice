module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: {
            file: 'site/assets/html/index.html'
        }
    },
    {
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: 'bower_components/'
            }
        }
    },
    {
        method: 'GET',
        path: '/assets/{file}',
        handler: {
            directory: {
                path: 'assets/'
            }
        }
    },
    {
        method: 'GET',
        path: '/site/{file*}',
        handler: {
            directory: {
                path: 'site/'
            }
        }
    }
];
