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
        this._tabs = [];
        this._tabsById = {};

        this._titleById = {};
        this._paneById = {};
    }

    var proto = TabsView.prototype;

    proto.render = function() {
        var assets = this.assets;
        var asMain = assets.main = this._createMainContainer();
        var asTitles = assets.titles = this._createTitlesContainer();
        var asPanes = assets.panes = this._createPanesContainer();
        asMain.appendChild(asTitles);
        asMain.appendChild(asPanes);
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
        this._applyRemoveTab(id);
    };

    proto.activeTab = function(id) {
        //TODO: get
        var old = this._activeTabId;
        this._activeTabId = id;
        this._applyActiveTab(id, old);
    };

    proto.tabTitle = function() {

    };

    proto._createTabTitle = function(tab) {
        return domElement('li', null, [
            domElement('a', {
                'href' : 'javascript:void(0)',
                'data-tab-id' : tab.id,
                $text : tab.title
            })
        ]);
    };

    proto._createTabPane = function(tab) {
        return domElement('div', {
            $html : tab.content //TODO: normalize to allow use string as well as HTMLElement
        });
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
        var title = this._createTabTitle(tab);
        var pane = this._createTabPane(tab);
        this.assets.titles.appendChild(title);
        this.assets.panes.appendChild(pane);

        this._titleById[tab.id] = title;
        this._paneById[tab.id] = pane;
    };

    proto._applyRemoveTab = function(id) {
        //TODO: works?
        this.assets.titles.removeChild(this._titleById[id]);
        this.assets.panes.removeChild(this._paneById[id]);

        delete this._titleById[id];
        delete this._paneById[id];
    };
    
    proto._applyActiveTab = function(id, oldId) {
        if(oldId === id) {
            return;
        }
        var title = this._titleById[id];
        var pane = this._paneById[id];
        
        title.setAttribute('class', 'active');

        var panes = this.assets.panes;
        while(panes.firstChild) {
            panes.removeChild(panes.firstChild);
        }
        panes.appendChild(pane);
    };

    proto._getTitleElement = function (id) {
        return this._titleById[id];
    };

    proto._getPaneElement = function (id) {
        return this._paneById[id];
    };

    function domElement(tag, attrs, children) {
        attrs = attrs || {};
        children = children || {};
        var el = document.createElement(tag);
        for (var attrName in attrs) {
            if (!attrs.hasOwnProperty(attrName)) {
                continue;
            }
            var value = attrs[attrName];
            if(attrName === '$text') {
                el.innerText = value;
                continue;
            }
            if(attrName === '$html') {
                el.innerHTML = value;
                continue;
            }
            el.setAttribute(attrName, value);
        }

        for (var i = 0; i < children.length; i++) {
            el.appendChild(children[i]);
        }

        return el;
    }

    return TabsView;
}));