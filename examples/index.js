define(function(require) {
    var TabsView = require('../TabsView');

    var navigation = new TabsView({
        renderTo: document.body,
        activeTab: 'catpaw',
        vertical: true,
        tabs: [{
            id: 'simple',
            title: 'Simple'
        }, {
            id: 'vertical',
            title: 'Vertical'
        }, {
            id: 'catpaw',
            title: 'Cat Paw'
        }],
        events: {
            initTab: function(id) {
                var self = this;
                this.tabContent(id, 'Loading example...');
                require(['examples.' + id], function(example) {
                    example(function(result) {
                        self.tabContent(id, result);
                    });
                });
            }
        }
    });
});

// var examples = {};

// function main() {
//     var navigation = new TabsView({
//         renderTo: document.body,
//         activeTab: 'simple',
//         vertical: true,
//         tabs: [{
//             id: 'simple',
//             title: 'Simple'
//         }, {
//             id: 'vertical',
//             title: 'Vertical'
//         }],
//         events: {
//             initTab: function(id) {
//                 this.tabContent(id, examples[id]());
//             }
//         }
//     });
// }

// main();