define([
    'dojo/has',
    'dojo/request/xhr',

    'esri/config'
], function (
    has,
    xhr,

    esriConfig
) {
    // force api to use CORS on mapserv thus removing the test request on app load
    esriConfig.defaults.io.corsEnabledServers.push('api.mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('discover.agrc.utah.gov');

    window.AGRC = {
        version: '1.0.0',
        urls: {
            trails: 'http://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahTrails/FeatureServer/0'
        },
        secrets: {
        }
    };

    if (has('agrc-build') === 'prod') {
        // mapserv.utah.gov
        window.AGRC.secrets.quadWord = 'alfred-plaster-crystal-dexter';
    } else if (has('agrc-build') === 'stage') {
        // test.mapserv.utah.gov
        window.AGRC.secrets.quadWord = 'opera-event-little-pinball';
    } else {
        // localhost
        xhr(require.baseUrl + 'secrets.json', {
            handleAs: 'json',
            sync: true
        }).then(function (secrets) {
            window.AGRC.secrets.quadWord = secrets.quadWord;
        }, function () {
            throw 'Error getting secrets!';
        });
    }

    return window.AGRC;
});
