define([
    './config',
    './Geolocation',
    './MapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/on',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',
    'dojo/dom-construct',

    'esri/map',
    'esri/geometry/Extent',
    'esri/geometry/Point',
    'esri/geometry/webMercatorUtils',
    'esri/layers/FeatureLayer',
    'esri/dijit/HomeButton',

    'layer-selector',

    'bootstrap'
], (
    config,
    Geolocator,
    MapController,

    _TemplatedMixin,
    _WidgetBase,

    on,
    template,
    declare,
    domConstruct,

    Map,
    Extent,
    Point,
    webMercatorUtils,
    FeatureLayer,
    HomeButton,

    LayerSelector
) => {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,

        class: 'app nav__below',

        postCreate() {
            console.info('app/App::postCreate', arguments);

            var map = new Map(this.mapNode, {
                useDefaultBaseMap: false,
                showAttribution: false,
                fitExtent: true,
                extent: new Extent({
                    xmax: -12010849.397533866,
                    xmin: -12898741.918094235,
                    ymax: 5224652.298632992,
                    ymin: 4422369.249751998,
                    spatialReference: {
                        wkid: 3857
                    }
                })
            });

            var layerSelector = new LayerSelector({
                map: map,
                quadWord: window.AGRC.secrets.quadWord,
                baseLayers: ['Terrain', 'Hybrid']
            });

            layerSelector.startup();

            var trails = new FeatureLayer(config.urls.trails, {});
            map.addLayer(trails);

            MapController.initialize(map);
            MapController.activateLayer(trails);

            this.setupConnections();
            this._addButtons(map);
        },
        setupConnections() {
            console.info('app/App::setupConnections', arguments);

            var parent = document.getElementById('navbar-collapse');
            this.own(
                on(parent, 'li.filter-item>a:click', (evt) => {
                    MapController.filter(...this._prepareFilterData(evt.target.href));
                }
            ));
        },
        _prepareFilterData(criteria) {
            // summary:
            //      modifies the event data for the feature layer
            // returns an array that can be spread
            console.info('app/App:_prepareFilterData', arguments);

            // remove #
            criteria = criteria.substring(criteria.indexOf('#') + 1);

            return ['DesignatedUses', criteria, 'string'];
        },
        _addButtons(map) {
            // summary:
            //      add the buttons below the zoomer
            console.info('app/App:_addButtons', arguments);

            var geoButtonTemplate = '<button class="geolocate btn btn-default btn-icon nav-btn">' +
                            '<span class="glyphicon glyphicon-screenshot"></span></button>';

            var home = new HomeButton({
                map: map
            }, this.homeNode);

            if (navigator.geolocation) {
                var geoButton = domConstruct.toDom(geoButtonTemplate);
                domConstruct.place(geoButton, this.buttonContainer);

                on(geoButton, 'click', this.zoomToCurrentPosition);
            }
            home.startup();
        },
        zoomToCurrentPosition() {
            // summary:
            //      description
            // param or return
            console.info('app/App:zoomToCurrentPosition', arguments);

            Geolocator.getCurrentPosition(navigator).then(
                (pos) => {
                    var mountainLevel = 15;
                    var coords = webMercatorUtils.lngLatToXY(pos.coords.longitude, pos.coords.latitude);
                    var location = new Point(coords, MapController.map.spatialReference);
                    MapController.map.centerAndZoom(location, mountainLevel);
                },
                (err) => console.error(err)
            );
        }
    });
});
