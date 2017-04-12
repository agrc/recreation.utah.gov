define([
    'dojo/text!./templates/bikeonstreet.html',
    'dojo/text!./templates/peak.html',
    'dojo/text!./templates/trail.html',
    'dojo/text!./templates/trailhead.html',
    'dojo/text!./templates/skilift.html',
    'dojo/text!./templates/skiarea.html',
    'dojo/text!./templates/xcski.html',
    'dojo/text!./templates/urbanpark.html',
    'dojo/text!./templates/golf.html',
    'dojo/text!./templates/boat.html',
    'dojo/text!./templates/park.html',
    'dojo/text!./templates/snowmobile.html',

    'dojo/has',
    'dojo/request/xhr',

    'esri/config',
    'esri/symbols/SimpleMarkerSymbol'
], function (
    bikeonstreet,
    peak,
    trail,
    trailhead,
    skilift,
    skiarea,
    xcski,
    urbanpark,
    golf,
    boat,
    park,
    snowmobile,
    has,
    xhr,

    esriConfig,
    SimpleMarkerSymbol
) {
    // force api to use CORS on mapserv thus removing the test request on app load
    esriConfig.defaults.io.corsEnabledServers.push('api.mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('discover.agrc.utah.gov');
    let recreation = 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Recreation/';

    window.AGRC = {
        version: '1.3.2',
        urls: {
            bikeonstreet: {
                url: recreation + 'FeatureServer/9',
                fields: ['FULLNAME', 'SPEED']
            },
            peak: {
                url: recreation + 'FeatureServer/8',
                fields: ['NAME', 'ELEVATION']
            },
            trail: {
                url: recreation + 'FeatureServer/7',
                fields: ['PrimaryName', 'DesignatedUses']
            },
            trailhead: {
                url: recreation + 'FeatureServer/6',
                fields: ['PrimaryName']
            },
            skilift: {
                url: recreation + 'FeatureServer/5',
                fields: ['LIFT_NAME', 'TYPE', 'RESORT', 'BASE_ELEVATION', 'TOP_ELEVATION', 'CAPACITY']
            },
            skiarea: {
                url: recreation + 'FeatureServer/4',
                fields: ['NAME']
            },
            xcski: {
                url: recreation + 'FeatureServer/3',
                fields: ['NAME', 'XC_AREA']
            },
            urbanpark: {
                url: recreation + 'FeatureServer/2',
                fields: ['NAME', 'ACRES', 'TYPE']
            },
            golf: {
                url: recreation + 'FeatureServer/1',
                fields: ['NAME', 'Holes', 'Par', 'Type']
            },
            boat: {
                url: recreation + 'FeatureServer/0',
                fields: ['Name', 'Water_body', 'Vessels']
            },
            park: {
                url: 'https://tlamap.trustlands.utah.gov/' +
                     'arcgis/rest/services/SpecialProject/UT_SITLA_LandOwnership_WM/FeatureServer/0',
                fields: ['STATE_LGD', 'GIS_Acres']
            },
            snowmobile: {
                url: 'https://maps.dnr.utah.gov/arcgis/rest/services/DPR/SnowmobileTrails/FeatureServer/0',
                fields: ['System_Nam', 'Weblink1']
            }
        },
        secrets: {
        },
        symbols: {
            point: new SimpleMarkerSymbol({
                color: [0, 116, 217, 200], // eslint-disable-line no-magic-numbers
                size: 11,
                angle: 0,
                xoffset: 0,
                yoffset: 0,
                type: 'esriSMS',
                style: 'esriSMSCircle',
                outline: {
                    color: [255, 255, 255, 255], // eslint-disable-line no-magic-numbers
                    width: 1.6,
                    type: 'esriSLS',
                    style: 'esriSLSSolid'
                }
            })
        },
        topics: {
            graphics: {
                highlight: 'a',
                clear: 'b'
            }
        },
        popupTemplates: {
            bikeonstreet: {
                title: 'On Street Biking',
                template: bikeonstreet
            },
            peak: {
                title: 'High Points and Summits',
                template: peak
            },
            trail: {
                title: 'Trails',
                template: trail
            },
            trailhead: {
                title: 'Trailheads',
                template: trailhead
            },
            skilift: {
                title: 'Ski Lifts',
                template: skilift
            },
            skiarea: {
                title: 'Ski Area Boundary',
                template: skiarea
            },
            xcski: {
                title: 'XC Ski',
                template: xcski
            },
            urbanpark: {
                title: 'Urban Parks',
                template: urbanpark
            },
            golf: {
                title: 'Golf Course',
                template: golf
            },
            boat: {
                title: 'Boat Ramps',
                template: boat
            },
            park: {
                title: 'National Parks',
                template: park
            },
            snowmobile: {
                title: 'Groomed Snowmobile Trails',
                template: snowmobile
            }
        }
    };

    if (has('agrc-build') === 'prod') {
        // mapserv.utah.gov
        config.secrets.quadWord = 'alfred-plaster-crystal-dexter';
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
