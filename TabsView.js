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

    function TabsView(options) {
        this.assets = {};
        this._tabs = [];
        this._tabsById = {};

        this._titleById = {};
        this._paneById = {};

        this._processOptions(options);
    }

    var proto = TabsView.prototype;

    proto.render = function(target) {
        if (!this._isRendered()) {
            this._initLayout();
            this._applyAll();
            this._bindEvents();
        }

        var asMain = this.assets.main;

        //TODO what if target is a string?
        if (target) {
            target.appendChild(asMain);
        }
        return asMain;
    };

    proto._processOptions = function(options) {
        options = options || {};
        var tabs = options.tabs || [];
        var activeTab = options.activeTab || false;
        var events = options.events || {};
        var renderTo = options.renderTo || false;

        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            this.addTab(tab.id, tab.title, tab.content);
        }

        if (activeTab) {
            this.activeTab(activeTab);
        }

        if(renderTo) {
            this.render(renderTo);
        }
    };

    proto._initLayout = function() {
        var assets = this.assets;
        var asMain = assets.main = this._createMainContainer();
        var asTitles = assets.titles = this._createTitlesContainer();
        var asPanes = assets.panes = this._createPanesContainer();
        asMain.appendChild(asTitles);
        asMain.appendChild(asPanes);
    };

    proto._isRendered = function() {
        return !!this.assets.main;
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
        if(!tab) {
            throw new Error('Tab not found');
        }
        var index = -1;
        for (var i = 0; i < this._tabs.length; i++) {
            //why not indexOf? because IE!
            if(tab === this._tabs[i]) {
                index = i;
                break;
            }
        }

        //The removed tab is active
        if(this._activeTabId === id) {
            if(this._tabs.length === 1) {
                //only one tab left - just remove content pane
                this._removeActivePane();
            } else if(index === 0) {
                //we are removing the first tab - switch to the second one
                this.activeTab(this._tabs[1].id);
            } else {
                //switch to the first tab
                this.activeTab(this._tabs[0].id);
            }
        }

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
                'href': 'javascript:void(0)',
                'data-tab-id': tab.id,
                $text: tab.title
            })
        ]);
    };

    proto._createTabPane = function(tab) {
        var node = domElement('div', {
            'class': 'tabs-pane'
        });
        if (tab.content instanceof HTMLElement) {
            node.appendChild(tab.content);
        } else {
            node.innerHTML = tab.content;
        }
        return node;
    };

    proto._createMainContainer = function() {
        return domElement('div', {
            'class': 'tabs-view'
        });
    };

    proto._createTitlesContainer = function() {
        return domElement('ul', {
            'class': 'tabs clearfix'
        });
    };

    proto._createPanesContainer = function() {
        return domElement('div', {
            'class': 'panes'
        });
    };

    proto._applyAddTab = function(tab) {
        if (!this._isRendered()) {
            return;
        }

        var title = this._createTabTitle(tab);
        var pane = this._createTabPane(tab);
        this.assets.titles.appendChild(title);

        this._titleById[tab.id] = title;
        this._paneById[tab.id] = pane;
    };

    proto._applyRemoveTab = function(id) {
        if (!this._isRendered()) {
            return;
        }

        this.assets.titles.removeChild(this._titleById[id]);

        delete this._titleById[id];
        delete this._paneById[id];
    };

    proto._applyActiveTab = function(id, oldId) {
        if (!this._isRendered()) {
            return;
        }

        if (oldId === id) {
            return;
        }
        var title = this._titleById[id];
        var pane = this._paneById[id];

        if (oldId !== undefined) {
            var oldTitle = this._titleById[oldId];
            oldTitle.setAttribute('class', '');
        }
        title.setAttribute('class', 'active');

        var panes = this.assets.panes;
        this._removeActivePane();
        panes.appendChild(pane);
    };

    proto._removeActivePane = function () {
        if(!this._isRendered()) {
            return;
        }
        var panes = this.assets.panes;
        while (panes.firstChild) {
            panes.removeChild(panes.firstChild);
        }
    };

    proto._applyAll = function() {
        var tabs = this._tabs;
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            this._applyAddTab(tab);
        }
        this._applyActiveTab(this._activeTabId);
    };

    proto._bindEvents = function() {
        //TODO: IE!
        var self = this;
        this.assets.titles.addEventListener('click',
            function(event) {
                return self._onTitleClick(event);
            },
            false
        );
    };

    proto._onTitleClick = function(event) {
        var target = event.target; //TODO: IE!
        if (!target) {
            return;
        }
        if (!target.hasAttribute('data-tab-id')) {
            return;
        }
        var tabId = target.getAttribute('data-tab-id');
        this.activeTab(tabId);
    };

    proto._getTitleElement = function(id) {
        return this._titleById[id];
    };

    proto._getPaneElement = function(id) {
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
            if (attrName === '$text') {
                el.textContent = value;
                continue;
            }
            if (attrName === '$html') {
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