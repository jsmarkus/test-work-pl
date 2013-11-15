/*global TabsView, console*/


var tabs = new TabsView();

tabs.render();
console.log(tabs);
document.body.appendChild(tabs.assets.main);

tabs.addTab('one', 'One', 'Lorem ipsum');
tabs.addTab('two', 'Two', 'Hello world');
tabs.addTab('three', 'Three', 'Foo bar');
tabs.addTab('four', 'Four', 'Four');
tabs.addTab('five', 'Five', 'Five');
tabs.addTab('six', 'Six', 'Six');

tabs.removeTab('two');

tabs.activeTab('three');


var current = 0;
var tabIds = [
'four','five', 'six'
];
setInterval(function () {
    tabs.activeTab(tabIds[current++ % tabIds.length]);
}, 1000);