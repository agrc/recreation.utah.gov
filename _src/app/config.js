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
    let recreation = 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Recreation/';

    window.AGRC = {
        version: '1.3.1',
        urls: {
            bikeonstreet: recreation + 'FeatureServer/9',
            peak: recreation + 'FeatureServer/8',
            trail: recreation + 'FeatureServer/7',
            trailhead: recreation + 'FeatureServer/6',
            skilift: recreation + 'FeatureServer/5',
            skiarea: recreation + 'FeatureServer/4',
            xcski: recreation + 'FeatureServer/3',
            urbanpark: recreation + 'FeatureServer/2',
            golf: recreation + 'FeatureServer/1',
            boat: recreation + 'FeatureServer/0',
            park: 'https://tlamap.trustlands.utah.gov/' +
                   'arcgis/rest/services/SpecialProject/UT_SITLA_LandOwnership_WM/FeatureServer/0',
            snowmobile: 'https://maps.dnr.utah.gov/arcgis/rest/services/DPR/SnowmobileTrails/FeatureServer/0'
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
