/*global TabsView*/


var tabs = new TabsView();

function byId(id) {
	return document.getElementById(id);
}
tabs.addTab('one', 'One', byId('fixture-one'));
tabs.addTab('two', 'Two', byId('fixture-two'));
tabs.addTab('three', 'Three', byId('fixture-three'));
tabs.addTab('four', 'Four', byId('fixture-four'));


tabs.activeTab('one');

tabs.render(document.body);
