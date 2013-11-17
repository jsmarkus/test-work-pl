define(function(require) {
    return function(done) {
        var TabsView = require('../TabsView');
        var tabs = new TabsView({
            activeTab: '0',
            tabs: [{
                id: 0,
                title: 'First',
                content: 'Ooooo'
            },{
                id: 1,
                title: 'Second',
                content: 'Ppppp'
            }]
        });

        done(tabs.render());
    };
});