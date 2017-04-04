require({
    packages: [
        'app',
        'agrc',
        'dgauges',
        'dgrid',
        'dgrid1',
        'dijit',
        'dojo',
        'dojox',
        'dstore',
        'esri',
        'moment',
        'put-selector',
        'layer-selector',
        {
            name: 'proj4',
            location: './proj4/dist',
            main: 'proj4'
        },
        'xstyle',
        {
            name: 'bootstrap',
            location: '../node_modules/bootstrap',
            main: 'dist/js/bootstrap'
        }, {
            name: 'jquery',
            location: '../node_modules/jquery',
            main: 'dist/jquery'
        }
    ],
    map: {
        dgrid1: {
            dgrid: 'dgrid1'
        }
    }
});
