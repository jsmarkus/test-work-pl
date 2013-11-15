/*global TabsView, console*/


var tabs = new TabsView();

tabs.render();
console.log(tabs);
document.body.appendChild(tabs.assets.main);

tabs.addTab('one', 'One', 'Lorem ipsum');
tabs.addTab('two', 'Two', 'Hello world');
tabs.addTab('three', 'Three', 'Foo bar');
tabs.addTab('four', 'Four', 'Foo bar');
tabs.addTab('five', 'Five', 'Foo bar');
tabs.addTab('six', 'Six', 'Foo bar');

tabs.removeTab('two');

tabs.activeTab('three');
