/*global TabsView*/


var tabs = new TabsView();


tabs.addTab('one', 'One', 'Lorem ipsum');
tabs.addTab('two', 'Two', 'Hello world');
tabs.addTab('three', 'Three', 'Foo bar');
tabs.addTab('four', 'Four', 'Four');
tabs.addTab('five', 'Five', 'Five');
tabs.addTab('six', 'Six', 'Six');

tabs.removeTab('two');

tabs.activeTab('three');

tabs.render(document.body);
