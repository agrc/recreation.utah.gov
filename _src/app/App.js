define([
    './config',
    './MapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/on',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',

    'esri/map',
    'esri/geometry/Extent',
    'esri/layers/FeatureLayer',

    'layer-selector',

    'bootstrap'
], (
    config,
    MapController,

    _TemplatedMixin,
    _WidgetBase,

    on,
    template,
    declare,

    Map,
    Extent,
    FeatureLayer,

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
        _prepareFilterData: function (criteria) {
            // summary:
            //      modifies the event data for the feature layer
            // returns an array that can be spread
            console.info('app/App:_prepareFilterData', arguments);

            // remove #
            criteria = criteria.substring(criteria.indexOf('#') + 1);

            return ['DesignatedUses', criteria, 'string'];
        }
    });
});
