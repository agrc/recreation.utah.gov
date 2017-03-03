define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/on',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',

    'esri/Map',
    'esri/geometry/Extent',

    'layer-selector'
], (
    _TemplatedMixin,
    _WidgetBase,

    on,
    template,
    declare,

    Map,
    Extent,

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
                quadWord: '',
                baseLayers: ['Hybrid', 'Lite']
            });

            layerSelector.startup();

            this.setupConnections();
        },
        setupConnections() {
            console.info('app/App::setupConnections', arguments);

            var parent = document.getElementById('navbar-collapse');
            this.own(on(parent, 'li.filter-item>a:click', (evt) => {
                console.debug(`applying a filter for ${evt.target.innerHTML}`);
            }));
        }
    });
});
