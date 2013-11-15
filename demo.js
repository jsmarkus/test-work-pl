/*global TabsView*/

function byId(id) {
    return document.getElementById(id);
}

function fixture(fixtureId) {
    return byId('fixture-' + fixtureId);
}

var tabs = new TabsView({
    renderTo: document.body,

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
    }],

    activeTab: 'three'
});

var nestedTabs = new TabsView({
    tabs: [{
        id: 'one',
        title: 'Hello',
        content: 'Hello world!'
    },{
        id: 'lorem',
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet, etc.'
    }],

    activeTab: 'one'
});

tabs.addTab('nested', 'Nested', nestedTabs.render());