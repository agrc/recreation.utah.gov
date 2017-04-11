define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var parser = require('app/QueryParser');
    var domConstruct = require('dojo/dom-construct');

    registerSuite({
        name: 'app/QueryParser',

        layerAttributeValue: function () {
            var element = '<a data-layer1="trail" data-attribute1="DesignatedUses" data-value1="BIKE"></a>';
            var node = domConstruct.toDom(element);
            assert.deepEqual(parser.parseDataAttributes(node),
                [{
                    layer: 'trail',
                    attribute: 'DesignatedUses',
                    value: 'BIKE',
                    match: null
                }], 'layer, attribute, value');
        },

        layerAttributeMultipleValue: function () {
            var element = '<a data-layer1="trail" data-attribute1="DesignatedUses" data-value1="BIKE,ATV"></a>';
            var node = domConstruct.toDom(element);
            assert.deepEqual(parser.parseDataAttributes(node),
                [{
                    layer: 'trail',
                    attribute: 'DesignatedUses',
                    value: 'BIKE,ATV',
                    match: null
                }], 'mutliple value');
        },

        multipleLayerNoQuery: function () {
            var element = '<a data-layer1="skiarea" data-layer2="skilift"></a>';
            var node = domConstruct.toDom(element);
            assert.deepEqual(parser.parseDataAttributes(node),
                [{
                    layer: 'skiarea',
                    attribute: null,
                    value: null,
                    match: null
                }, {
                    layer: 'skilift',
                    attribute: null,
                    value: null,
                    match: null
                }], 'multiple layers with no definition query');
        },

        layerAttributeMatchTypeValue: function () {
            var element = '<a data-layer1="trail" ' +
                          'data-attribute1="DesignatedUses" ' +
                          'data-value1="HIKE" ' +
                          'data-match1="exact"></a>';
            var node = domConstruct.toDom(element);
            assert.deepEqual(parser.parseDataAttributes(node),
                [{
                    layer: 'trail',
                    attribute: 'DesignatedUses',
                    value: 'HIKE',
                    match: 'exact'
                }], 'layer, attribute, mutliple value');
        }
    });
});
