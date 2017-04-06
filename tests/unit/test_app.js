define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var parser = require('app/HrefParser');

    registerSuite({
        name: 'app/HrefParser',

        layerAttributeValue: function () {
            assert.deepEqual(parser.parseHref('#trail:DesignatedUses|BIKE'),
                               [['trail'], 'DesignatedUses', 'BIKE'],
                               'layer, attribute, value');
        },

        layerAttributeMultipleValue: function () {
            assert.deepEqual(parser.parseHref('#trail:DesignatedUses|OHV,ATV'),
                               [['trail'], 'DesignatedUses', 'OHV,ATV'],
                               'layer, attribute, mutliple value');
        },

        multipleLayerNoQuery: function () {
            assert.deepEqual(parser.parseHref('#skiarea:skilift:'),
                               [['skiarea', 'skilift'], ''], 'multiple layers with no definition query');
        },

        layerAttributeMatchTypeValue: function () {
            assert.deepEqual(parser.parseHref('#trail:DesignatedUses|stringExact|HIKE'),
                               [['trail'], 'DesignatedUses', 'HIKE', 'stringExact'],
                               'layer, attribute, mutliple value');
        }
    });
});
