/**
 * @author Mark <me@jsman.ru>
 * @license MIT
 * @class
 */
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

    /**
     * @typedef {Object} TabEvents
     * @property {funcion} activateTab called when the tab `id` is activated
     * @property {funcion} initTab called when the tab `id` is activated and it is empty. Use it to implement tab content loaders
     */

    /**
     * @typedef {Object} TabOptions
     * @property {String} id
     * @property {String} title
     * @property {String|HTMLElement} content
     */

    /**
     * @typedef {Object} TabsViewOptions
     * @property {HTMLElement} renderTo parent DOM node (used as a container)
     * @property {Boolean} vertical whether tabs are vertical
     * @property {Boolean} useWheel whether to use mouse whell to navigate. Default is `true`
     * @property {String} activeTab active tab ID
     * @property {Array.<TabOptions>} tabs array of tab definitions
     * @property {TabEvents} events event handlers
     */

    /**
     * @constructor
     * @alias TabsView
     * @param {TabsViewOptions} options
     */
    var TabsView = function(options) {
        this.assets = {};
        this._tabs = [];
        this._tabsById = {};

        this._titleNodeById = {};
        this._paneNodeById = {};

        this._processOptions(options);
    };

    /**
     * Renders DOM structure, if it is not already rendered.
     * Moves DOM to target. Returns DOM root.
     *
     * @memberof TabsView#
     * @param {HTMLElement} target
     * @return HTMLElement
     */
    TabsView.prototype.render = function(target) {
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

    /**
     * Processes constructor options.
     *
     * @memberof TabsView#
     * @access protected
     * @param {TabsViewOptions} options
     */
    TabsView.prototype._processOptions = function(options) {
        options = options || {};
        var tabs = options.tabs || [];
        var activeTab = options.activeTab || false;
        var renderTo = options.renderTo || false;

        var useWheel = 'useWheel' in options ? options.useWheel : true;

        var events = options.events || {};
        var initTab = 'function' === typeof events.initTab ? events.initTab : false;
        var activateTab = 'function' === typeof events.activateTab ? events.activateTab : false;

        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            this.addTab(tab.id, tab.title, tab.content);
        }

        if (activeTab) {
            this.activeTab(activeTab);
        }

        this._vertical = !!options.vertical;

        this._useWheel = !!useWheel;


        if (initTab) {
            this.__onInitTab = initTab;
        }
        if (activateTab) {
            this.__onActivateTab = activateTab;
        }

        if (renderTo) {
            this.render(renderTo);
        }
    };

    /**
     * Initializes initial DOM structure.
     *
     * @memberof TabsView#
     * @access protected
     */
    TabsView.prototype._initLayout = function() {
        var assets = this.assets;
        var asMain = assets.main = this._createMainContainer();
        var asTitles = assets.titles = this._createTitlesContainer();
        var asPanes = assets.panes = this._createPanesContainer();
        asMain.appendChild(asTitles);
        asMain.appendChild(asPanes);
    };

    /**
     * Checks if the widget is rendered
     *
     * @memberof TabsView#
     * @access protected
     * @returns {Boolean} true if the widget is rendered
     */
    TabsView.prototype._isRendered = function() {
        return !!this.assets.main;
    };

    /**
     * Adds a tab
     *
     * @memberof TabsView#
     * @param {String} id
     * @param {String} title
     * @param {String|HTMLElement} content
     */
    TabsView.prototype.addTab = function(id, title, content) {
        var tab = {
            id: id,
            title: title,
            content: content
        };
        this._tabs.push(tab);
        this._tabsById[id] = tab; //TODO: control unique id
        this._applyAddTab(tab);
    };

    /**
     * Removes tab with the given `id`
     *
     * @memberof TabsView#
     * @param {String} id tab id
     */
    TabsView.prototype.removeTab = function(id) {
        var tab = this._getTab(id);
        var index = -1;
        for (var i = 0; i < this._tabs.length; i++) {
            //why not indexOf? because IE!
            if (tab === this._tabs[i]) {
                index = i;
                break;
            }
        }

        //The removed tab is active
        if (this._activeTabId === id) {
            if (this._tabs.length === 1) {
                //only one tab left - just remove content pane
                this._removeActivePane();
            } else if (index === 0) {
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

    /**
     * Sets activeTab to `id`
     *
     * @memberof TabsView#
     * @param {String} id tab id
     */
    TabsView.prototype.activeTab = function(id) {
        if (arguments.length === 0) {
            return this._activeTabId;
        }
        var old = this._activeTabId;
        this._activeTabId = id;
        this._applyActiveTab(id, old);
    };


    /**
     * Activates the next tab
     *
     * @memberof TabsView#
     */
    TabsView.prototype.nextTab = function() {
        var index = this._indexOf(this._activeTabId);
        var next = this._tabs[index + 1];
        if (next) {
            this.activeTab(next.id);
        }
    };

    /**
     * Activates the previous tab
     *
     * @memberof TabsView#
     */
    TabsView.prototype.prevTab = function() {
        var index = this._indexOf(this._activeTabId);
        var prev = this._tabs[index - 1];
        if (prev) {
            this.activeTab(prev.id);
        }
    };

    /**
     * Returns tab index by given tab `id`
     *
     * @memberof TabsView#
     * @param {String} id
     * @return {Number} index
     */
    TabsView.prototype._indexOf = function(id) {
        var tab = this._getTab(id);
        var index = -1;
        for (var i = 0; i < this._tabs.length; i++) {
            //why not indexOf? because IE!
            if (tab === this._tabs[i]) {
                index = i;
                break;
            }
        }
        return index;
    };

    /**
     * Gets or sets tab title
     *
     * @memberof TabsView#
     * @param {String} id tab id
     * @param {String=} title tab title
     * @return {String|undefined} Title, if only `id` is passed
     */
    TabsView.prototype.tabTitle = function(id, text) {
        var tab = this._getTab(id);
        if (arguments.length === 1) {
            return tab.title;
        }
        tab.title = '' + text;
        var titleNode = this._titleNodeById[id];
        this._setTitleText(titleNode, text);
    };

    /**
     * Gets or sets tab content
     *
     * @memberof TabsView#
     * @param {String} id tab id
     * @param {String|HTMLElement=} title tab content
     * @return {String|undefined} Content, if only `id` is passed
     */
    TabsView.prototype.tabContent = function(id, content) {
        var tab = this._getTab(id);
        if (arguments.length === 1) {
            return tab.content;
        }
        tab.content = content;
        var paneNode = this._paneNodeById[id];
        this._setPaneContent(paneNode, content);
    };

    /**
     * Gets tab object by `id`
     *
     * @memberof TabsView#
     * @access protected
     * @param {String} id
     * @return {TabOptions} tab object
     */
    TabsView.prototype._getTab = function(id) {
        var tab = this._tabsById[id];
        if (!tab) {
            throw new Error('Tab not found');
        }
        return tab;
    };

    /**
     * Creates DOM structure for a tab title
     *
     * @memberof TabsView#
     * @access protected
     * @param {TabOptions} tab
     * @return {HTMLElement}
     */
    TabsView.prototype._createTabTitle = function(tab) {
        var node = domElement('li', {
            'data-tab-id': tab.id
        }, [
            domElement('a', {
                'href': 'javascript:void(0)',
                'data-tab-id': tab.id
            })
        ]);
        this._setTitleText(node, tab.title);
        return node;
    };

    /**
     * Sets title text in tab title DOM
     *
     * @memberof TabsView#
     * @access protected
     * @param {HTMLElement} titleNode
     * @param {String} text
     */
    TabsView.prototype._setTitleText = function(titleNode, text) {
        var anchor = titleNode.firstChild;
        setText(anchor, text);
    };

    /**
     * Sets pane content in tab pane DOM
     *
     * @memberof TabsView#
     * @access protected
     * @param {HTMLElement} paneNode
     * @param {String|HTMLElement|Null} content
     */
    TabsView.prototype._setPaneContent = function(paneNode, content) {
        if (content && content.nodeType) { //IE fix for instanceof HTMLElement
            paneNode.innerHTML = ''; //TODO: slow!
            paneNode.appendChild(content);
        } else {
            if (content === null && content === undefined) {
                content = '';
            }
            paneNode.innerHTML = content;
        }
    };

    /**
     * Creates DOM structure for pane
     *
     * @memberof TabsView#
     * @access protected
     * @param {TabOptions} tab
     * @return {HTMLElement}
     */
    TabsView.prototype._createTabPane = function(tab) {
        var node = domElement('div', {
            'class': 'tabs-pane'
        });
        this._setPaneContent(node, tab.content);
        return node;
    };

    /**
     * Creates main container DOM
     *
     * @memberof TabsView#
     * @access protected
     * @return {HTMLElement}
     */
    TabsView.prototype._createMainContainer = function() {
        var cls = 'tabs-view tabs-view-horizontal';
        if (this._vertical) {
            cls = 'tabs-view tabs-view-vertical';
        }
        return domElement('div', {
            'class': cls
        });
    };

    /**
     * Creates titles container DOM
     *
     * @memberof TabsView#
     * @access protected
     * @return {HTMLElement}
     */
    TabsView.prototype._createTitlesContainer = function() {
        return domElement('ul', {
            'class': 'tabs clearfix'
        });
    };

    /**
     * Creates panes container DOM
     *
     * @memberof TabsView#
     * @access protected
     * @return {HTMLElement}
     */
    TabsView.prototype._createPanesContainer = function() {
        return domElement('div', {
            'class': 'panes'
        });
    };

    /**
     * Applies adding tab to DOM
     *
     * @memberof TabsView#
     * @access protected
     * @param {TabOptions} tab
     */
    TabsView.prototype._applyAddTab = function(tab) {
        if (!this._isRendered()) {
            return;
        }

        var title = this._createTabTitle(tab);
        var pane = this._createTabPane(tab);
        this.assets.titles.appendChild(title);

        this._titleNodeById[tab.id] = title;
        this._paneNodeById[tab.id] = pane;
    };

    /**
     * Applies removing tab to DOM
     *
     * @memberof TabsView#
     * @access protected
     * @param {String} id
     */
    TabsView.prototype._applyRemoveTab = function(id) {
        if (!this._isRendered()) {
            return;
        }

        this.assets.titles.removeChild(this._titleNodeById[id]);

        delete this._titleNodeById[id];
        delete this._paneNodeById[id];
    };

    /**
     * Applies switching tab to DOM
     *
     * @memberof TabsView#
     * @access protected
     * @param {String} id
     * @param {String} oldid
     */
    TabsView.prototype._applyActiveTab = function(id, oldId) {
        var tab = this._getTab(id);

        if (!this._isRendered()) {
            return;
        }

        if (oldId === id) {
            return;
        }
        var title = this._titleNodeById[id];
        var pane = this._paneNodeById[id];

        if (oldId !== undefined) {
            var oldTitle = this._titleNodeById[oldId];
            oldTitle.setAttribute('class', '');
        }
        title.setAttribute('class', 'active');

        var panes = this.assets.panes;
        this._removeActivePane();
        panes.appendChild(pane);

        if (this.__onInitTab) {
            if (tab.content === undefined) {
                this.__onInitTab.call(this, id, tab);
            }
        }
        if (this.__onActivateTab) {
            this.__onActivateTab.call(this, id, tab);
        }
    };

    /**
     * Removes current pane from DOM
     *
     * @memberof TabsView#
     * @access protected
     */
    TabsView.prototype._removeActivePane = function() {
        if (!this._isRendered()) {
            return;
        }
        var panes = this.assets.panes;
        while (panes.firstChild) {
            panes.removeChild(panes.firstChild);
        }
    };

    /**
     * Applies all changes to DOM. Called once after a render
     *
     * @memberof TabsView#
     * @access protected
     */
    TabsView.prototype._applyAll = function() {
        var tabs = this._tabs;
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            this._applyAddTab(tab);
        }
        if (undefined === this._activeTabId) {
            this._activeTabId = tabs[0].id; //Set first tab as active if none is set
        }
        this._applyActiveTab(this._activeTabId);
    };

    /**
     * Bind event handlers. Called once after a render
     *
     * @memberof TabsView#
     * @access protected
     */
    TabsView.prototype._bindEvents = function() {
        //TODO: IE!
        var self = this;
        addEvent(
            this.assets.titles,
            'click',
            function(event) {
                return self._onTitleClick(event);
            }
        );
        if(this._useWheel) {
            addEvent(
                this.assets.titles,
                'mousewheel',
                function(event) {
                    return self._onTitleWheel(event);
                }
            );
            addEvent(
                this.assets.titles,
                'DOMMouseScroll',
                function(event) {
                    return self._onTitleWheel(event);
                }
            );
        }
    };

    /**
     * Handles clicking on tab title
     *
     * @memberof TabsView#
     * @access protected
     * @param {Event} event
     */
    TabsView.prototype._onTitleWheel = function(event) {
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))); //http://www.sitepoint.com/html5-javascript-mouse-wheel/
        event.preventDefault && event.preventDefault();
        event.returnValue = false;

        if (delta > 0) {
            this.prevTab();
            return;
        }
        this.nextTab();

    };
    TabsView.prototype._onTitleClick = function(event) {
        var target = event.target;
        if (!target) {
            return;
        }
        if (!target.hasAttribute('data-tab-id')) {
            return;
        }
        var tabId = target.getAttribute('data-tab-id');
        this.activeTab(tabId);
    };

    /**
     * Gets title DOM element
     *
     * @memberof TabsView#
     * @access protected
     * @param {String} id tab id
     * @return {HTMLElement}
     */
    TabsView.prototype._getTitleElement = function(id) {
        return this._titleNodeById[id];
    };

    /**
     * Gets pane DOM element
     *
     * @memberof TabsView#
     * @access protected
     * @param {String} id tab id
     * @return {HTMLElement}
     */
    TabsView.prototype._getPaneElement = function(id) {
        return this._paneNodeById[id];
    };

    /**
     * Creates DOM element
     * @access private
     * @param {String} tag
     * @param {Object} attrs
     * @param {Array.<HTMLElement>} children
     * @return {HTMLElement}
     */
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
                setText(el, value);
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

    /**
     * Sets inner text of DOM element
     * @access private
     * @param {HTMLElement} node
     * @param {String} text
     */
    function setText(node, text) {
        if ('innerText' in node) {
            node.innerText = text;
        }
        node.textContent = text;
    }

    /**
     * Adds event to DOM element
     * @access private
     * @param {HTMLElement} node
     * @param {String} eventName
     * @param {Function} handler
     */
    function addEvent(node, eventName, handler) {
        if (window.addEventListener) {
            return node.addEventListener(eventName, handler, false);
        }
        if (window.attachEvent) {
            return node.attachEvent('on' + eventName, function() {
                var e = window.event;
                e.target = e.srcElement;
                handler(e);
            });
        }
    }

    return TabsView;
}));