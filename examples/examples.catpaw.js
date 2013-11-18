define(function(require) {
    return function(done) {
        var TabsView = require('../TabsView');
        var tabs = new TabsView({
            activeTab: '0',
            tabs: [{
                id: 0,
                title: '1',
                content: 'Да-да. Это тоже TabsView!'
            },{
                id: 1,
                title: '2',
                content: 'Мяу!'
            },{
                id: 2,
                title: '3',
                content: 'Мяяяяу!'
            },{
                id: 3,
                title: '4',
                content: '<img src="./cat.jpg" width="100" />'
            }]
        });

        var dom = tabs.render();
        dom.className = dom.className + ' theme-paw';

        done(dom);
    };
});