define([
    './config',
    './Geolocation',
    './QueryParser',
    './GraphicsController',
    './MapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/on',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/dom-construct',

    'esri/map',
    'esri/graphic',
    'esri/InfoTemplate',
    'esri/geometry/Extent',
    'esri/geometry/Point',
    'esri/geometry/webMercatorUtils',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/dijit/HomeButton',

    'layer-selector',

    'bootstrap'
], (
    config,
    Geolocator,
    QueryParser,
    GraphicsController,
    MapController,

    _TemplatedMixin,
    _WidgetBase,

    on,
    template,
    declare,
    domClass,
    domConstruct,

    Map,
    Graphic,
    InfoTemplate,
    Extent,
    Point,
    webMercatorUtils,
    FeatureLayer,
    GraphicsLayer,
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
                quadWord: config.secrets.quadWord,
                baseLayers: ['Terrain', 'Hybrid', 'Topo', {
                    token: 'Lite',
                    selected: true,
                    linked: ['Overlay']
                }],
                overlays: ['Overlay', 'Address Points', {
                    Factory: FeatureLayer,
                    url: config.urls.park,
                    id: 'Land Ownership',
                    opacity: 0.5
                }]
            });

            layerSelector.startup();
            MapController.initialize(map);
            GraphicsController.initialize(config, config.symbols);

            let graphicsLayer = new GraphicsLayer({
                className: 'pulse'
            });

            GraphicsController.graphicsLayer = graphicsLayer;
            MapController.map.addLayer(graphicsLayer);

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

                    let options = QueryParser.parseDataAttributes(evt.target);

                    MapController.map.graphicsLayerIds.forEach((id) => {
                        let layer = MapController.map.getLayer(id);
                        layer.hide();
                    });

                    options.forEach((option) => {
                        if (MapController.map.graphicsLayerIds.indexOf(option.layer) > -1) {
                            MapController.activateLayer(MapController.map.getLayer(option.layer));
                        } else {
                            let templateData = config.popupTemplates[option.layer];
                            let infoTemplate = new InfoTemplate();

                            infoTemplate.setTitle(templateData.title);
                            infoTemplate.setContent(templateData.template);

                            let layer = new FeatureLayer(config.urls[option.layer].url, {
                                id: option.layer,
                                outFields: config.urls[option.layer].fields,
                                infoTemplate: infoTemplate
                            });

                            MapController.map.addLayer(layer);
                            MapController.activateLayer(layer);
                        }

                        MapController.filter(...this._prepareFilterData(option));
                    });
                }
            ));
        },
        _prepareFilterData(option) {
            // summary:
            //      modifies the event data for the feature layer
            // returns an array that can be spread
            console.info('app/App:_prepareFilterData', arguments);

            if (!option.match) {
                option.match = 'string';
            }

            return [option.attribute, option.value, option.match];
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
        zoomToCurrentPosition(evt) {
            // summary:
            //      description
            // param or return
            console.info('app/App:zoomToCurrentPosition', arguments);

            domClass.add(evt.target, 'spin');

            Geolocator.getCurrentPosition(navigator).then(
                (pos) => {
                    domClass.remove(evt.target, 'spin');

                    let mountainLevel = 15;
                    let coords = webMercatorUtils.lngLatToXY(pos.coords.longitude, pos.coords.latitude);
                    let location = new Point(coords, MapController.map.spatialReference);
                    let graphic = new Graphic(location);

                    MapController.map.centerAndZoom(location, mountainLevel);
                    GraphicsController.highlight(graphic);
                },
                (err) => {
                    console.error(err);
                    domClass.remove(evt.target, 'spin');
                }
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
