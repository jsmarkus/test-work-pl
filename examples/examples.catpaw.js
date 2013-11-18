define(function(require) {
    return function(done) {
        var TabsView = require('../TabsView');
        var tabs = new TabsView({
            activeTab: '0',
            tabs: [{
                id: 0,
                title: '1',
                content: ''
            },{
                id: 1,
                title: '2',
                content: ''
            },{
                id: 2,
                title: '3',
                content: ''
            },{
                id: 3,
                title: '4',
                content: ''
            }]
        });

        var dom = tabs.render();
        dom.className = dom.className + ' theme-paw';

        done(dom);
    };
});