/*global define, module*/
(function(root, factory) {
    'use strict';
    //UMD header
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.TabsView = factory();
    }
}(this, function() {
    'use strict';

    function TabsView() {
        this.assets = {};
    }

    var proto = TabsView.prototype;

    proto.addTab = function() {

    };

    proto.removeTab = function() {

    };

    proto.activeTab = function() {

    };

    proto.tabTitle = function() {

    };

    proto._createTabTitle = function() {

    };

    proto._createTabPane = function() {

    };

    proto._createTabPane = function() {

    };

    proto._createMainContainer = function() {

    };

    proto._createTitlesContainer = function() {

    };

    proto._createPanesContainer = function() {

    };

    return TabsView;
}));