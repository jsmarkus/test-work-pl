/*global TabsView*/

function demo() {
    'use strict';

    function byId(id) {
        return document.getElementById(id);
    }

    function fixture(fixtureId) {
        return byId('fixture-' + fixtureId);
    }

    var tabs = new TabsView({
        renderTo: document.getElementById('tabs-container'),

        tabs: [{
            id: 'one',
            title: 'One',
            content: fixture('one')
        }, {
            id: 'two',
            title: 'Two',
            content: fixture('two')
        }, {
            id: 'three',
            title: 'Three',
            content: fixture('three')
        }, {
            id: 'four',
            title: 'Four',
            content: fixture('four')
        }]
    });

    var nestedTabs = new TabsView({
        tabs: [{
            id: 'one',
            title: 'Ch1',
            content: fixture('nested-one')
        }, {
            id: 'lorem',
            title: 'Ch2',
            content: fixture('nested-two')
        }],

        vertical: true
    });

    tabs.addTab('nested', 'Nested vertical tabs', nestedTabs.render());

    tabs.tabTitle('two', 'Hello');

    //----------------------------

    var btnAddTab = byId('btn-addtab');
    var btnRemoveTab = byId('btn-removetab');
    var btnGetActiveTab = byId('btn-getactivetab');
    var outGetActiveTab = byId('out-getactivetab');
    var btnSetActiveTab = byId('btn-setactivetab');
    var btnTabContent = byId('btn-tabcontent');
    var inTabContent = byId('in-tabcontent');
    var btnTabTitle = byId('btn-tabtitle');
    var inTabTitle = byId('in-tabtitle');

    btnAddTab.onclick = function() {
        var id = 'tab-' + Math.floor(Math.random() * 1e5);
        tabs.addTab(id, 'new tab', 'New tab content. id="' + id + '"');
    };

    btnRemoveTab.onclick = function() {
        tabs.removeTab(tabs.activeTab());
    };

    btnSetActiveTab.onclick = function() {
        tabs.activeTab('three');
    };

    btnGetActiveTab.onclick = function() {
        outGetActiveTab.innerHTML = tabs.activeTab();
    };

    btnTabTitle.onclick = function () {
        tabs.tabTitle(tabs.activeTab(), inTabTitle.value);
    };

    btnTabContent.onclick = function () {
        tabs.tabContent(tabs.activeTab(), inTabContent.value);
    };
}