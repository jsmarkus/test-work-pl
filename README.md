TabsView
========

`TabsView` is used fot tabbed content navigation.

Tested in browsers:

 * Chrome 24
 * Firefox 12, 25
 * Opera 12
 * IE 8, 9, 10

Technologies:

Vanilla JS.

### Usage

Include JS module and CSS theme:

```html
    <link rel="stylesheet" type="text/css" href="tabs-view.css">
    <script src="TabsView.js"></script>
```

You can also use AMD and CommonJS as `require('path/to/TabsView')`.

Create widget:

```javascript
var tabs = new TabsView();
```

Create widget with options:

```javascript
//All options are optional.

var tabs = new TabsView({
    
    //Pre-configured tabs:
    tabs: [{
        id: 'one',
        title: 'First',
        content: 'Hello world'
    }, {
        id: 'two',
        title: 'Second',
        content: 'Howdy universe!'
    }],

    //Select active tab:
    activeTab: 'two', //deafult: first tab

    //Vertical tabs orientation:
    vertical: true, //default: false
    
    //Do not use mouse wheel
    useWheel: false, //default is true, i.e. mouse wheel is used by default

    //What element is used as container:
    renderTo: document.body, //default: none

    //event handlers
    events: {
        //Called when a tab with no content is activated.
        //Useful for dynamic tab content loaders.
        initTab : function (id) {

        },
        
        //Called when a tab is activated.
        activateTab : function (id) {

        }
    }
});
```


Add a tab:

```javascript
tabs.addTab('tab-id-100', 'Title', 'Some content...');
```

Remove a tab:


```javascript
tabs.removeTab('tab-id-100');
```

Activate (select) a tab programmatically:

```javascript
tabs.activeTab('tab-id-100');
```

Find out which tab is active:

```javascript
tabs.activeTab(); //returns 'tab-id-100'
```

Activate next tab:

```javascript
tabs.nextTab();
```

Activate previous tab:

```javascript
tabs.prevTab();
```

Set tab title:

```javascript
tabs.tabTitle('tab-id-100', 'Some Title');
```

Get tab title:

```javascript
tabs.tabTitle('tab-id-100'); //returns 'Some Title'
```

Set tab content:

```javascript
//DOM element:
tabs.tabContent('tab-id-100', document.getElemenById('my-cool-page'));

//Plain text:
tabs.tabContent('tab-id-100', 'Hello world!');
```

Get tab content:

```javascript
tabs.tabContent('tab-id-100'); //returns 'Hello world!'
```

Render to container:

```javascript
tabs.render(document.body);
```

Get DOM:

```javascript
tabs.render(); //returns tabs view DOM element. You can appendChild it to somewhere
```
