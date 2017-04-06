define([
    './config',
    './Geolocation',
    './HrefParser',
    './MapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/on',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',
    'dojo/dom-class',
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
    HrefParser,
    MapController,

    _TemplatedMixin,
    _WidgetBase,

    on,
    template,
    declare,
    domClass,
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

            let map = new Map(this.mapNode, {
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

            let layerSelector = new LayerSelector({
                map: map,
                quadWord: window.AGRC.secrets.quadWord,
                baseLayers: ['Terrain', 'Hybrid']
            });

            layerSelector.startup();
            MapController.initialize(map);

            this.setupConnections();
            this._addButtons(map);
        },
        setupConnections() {
            console.info('app/App::setupConnections', arguments);

            let parent = document.getElementById('navbar-collapse');
            this.own(
                on(parent, 'li.filter-item>a:click', (evt) => {
                    if (domClass.contains(evt.target.parentElement, 'disabled')) {
                        return;
                    }

                    let parsed = HrefParser.parseHref(evt.target.href);
                    let layers = parsed[0];
                    let field = parsed[1];
                    let value = parsed[2];
                    let match = null;
                    const hasMatch = 4;

                    if (parsed.length === hasMatch) {
                        value = parsed[2];
                        match = parsed[3];
                    }

                    MapController.map.graphicsLayerIds.forEach((id) => {
                        let layer = MapController.map.getLayer(id);
                        layer.hide();
                    });

                    layers.forEach((layerId) => {
                        if (MapController.map.graphicsLayerIds.indexOf(layerId) > -1) {
                            MapController.activateLayer(MapController.map.getLayer(layerId));
                        } else {
                            let layer = new FeatureLayer(config.urls[layerId], {
                                id: layerId
                            });

                            MapController.map.addLayer(layer);
                            MapController.activateLayer(layer);
                        }

                        MapController.filter(...this._prepareFilterData(field, match, value));
                    });
                }
            ));
        },
        _prepareFilterData(field, match, value) {
            // summary:
            //      modifies the event data for the feature layer
            // returns an array that can be spread
            console.info('app/App:_prepareFilterData', arguments);

            if (!match) {
                match = 'string';
            }

            return [field, value, match];
        },
        _addButtons(map) {
            // summary:
            //      add the buttons below the zoomer
            console.info('app/App:_addButtons', arguments);

            let geoButtonTemplate = '<button class="geolocate btn btn-default btn-icon nav-btn">' +
                            '<span class="glyphicon glyphicon-screenshot"></span></button>';

            let home = new HomeButton({
                map: map
            }, this.homeNode);

            home.startup();

            if (!this.supportsGeolocation()) {
                console.warn('geolocation is not supported in this browser or without https.');

                return;
            }

            let geoButton = domConstruct.toDom(geoButtonTemplate);
            domConstruct.place(geoButton, this.buttonContainer);

            on(geoButton, 'click', this.zoomToCurrentPosition);
        },
        zoomToCurrentPosition() {
            // summary:
            //      description
            // param or return
            console.info('app/App:zoomToCurrentPosition', arguments);

            Geolocator.getCurrentPosition(navigator).then(
                (pos) => {
                    let mountainLevel = 15;
                    let coords = webMercatorUtils.lngLatToXY(pos.coords.longitude, pos.coords.latitude);
                    let location = new Point(coords, MapController.map.spatialReference);
                    MapController.map.centerAndZoom(location, mountainLevel);
                },
                (err) => console.error(err)
            );
        },
        supportsGeolocation() {
            // summary:
            //      returns true if geolocation is ok
            // boolean
            console.info('app/App:supportsGeolocation', arguments);

            if (!navigator.geolocation) {
                return false;
            }

            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                return false;
            }

            return true;
        }
    });
});
