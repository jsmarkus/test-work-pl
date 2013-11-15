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

    proto.render = function() {
        var assets = this.assets;
        var asMain = assets.main = this._createMainContainer();
        var asTitles = assets.titles = this._createTitlesContainer();
        var asPanes = assets.panes = this._createPanesContainer();
        asMain.appendChild(asTitles);
        asMain.appendChild(asPanes);
        this._tabs = [];
        this._tabsById = {};
    };

    proto.addTab = function(id, title, content) {
        var tab = {
            id: id,
            title: title,
            content: content
        };
        this._tabs.push(tab);
        this._tabsById[id] = tab; //TODO: control unique id
        this._applyAddTab(tab);
    };

    proto.removeTab = function(id) {
        var tab = this._tabsById[id];
        //TODO: 404
        var index = this._tabs.indexOf(tab);
        //TODO: IE ployfill
        this._tabs.splice(index, 1);
        delete this._tabsById[id];
        this._applyRemoveTab(index);
    };

    proto.activeTab = function() {

    };

    proto.tabTitle = function() {

    };

    proto._createTabTitle = function() {

    };

    proto._createTabPane = function() {

    };

    proto._createMainContainer = function() {
        return domElement('div', {
            'class': 'tabs-view'
        });
    };

    proto._createTitlesContainer = function() {
        return domElement('ul', {
            'class': 'tabs'
        });
    };

    proto._createPanesContainer = function() {
        return domElement('div', {
            'class': 'panes'
        });
    };

    proto._applyAddTab = function(tab) {

    };

    proto._applyRemoveTab = function(index) {

    };

    function domElement(tag, attrs) {
        var el = document.createElement(tag);
        attrs = attrs || {};
        for (var attrName in attrs) {
            if (!attrs.hasOwnProperty(attrName)) {
                continue;
            }
            el.setAttribute(attrName, attrs[attrName]);
        }
        return el;
    }

    return TabsView;
}));