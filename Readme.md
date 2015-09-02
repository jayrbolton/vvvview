# vvvview

This is just a convenience wrapper around virtual-dom boilerplate that we use for front-end rendering and syncing at [CommitChange](https://github.com/commitchange/)

It is very very light and very quick.

### createView(rootNode, rootComponent, options)

Construct a new view instance. Require it with `require('vvvview/create')`. Pass in:

* rootNode: the node where you want to mount your virtual-dom (eg document.body)
* rootComponent: a function that takes some state and returns a vdom.
* options:
 * defaultState: this can be a default javascript object for your initial state
 * cacheState: if you want to cache the whole state to localStorage automatically, pass in a key name for this option (eg 'appView')

Example:

```js
var createView = require('vvvoiew/create')
var render = require('vvvview/render')
var h = require('virtual-dom/h')

function hello(msg) {
	return h('p', msg)
}

helloView = createview(document.body, hello)

helloView.state = {msg: 'hi'}
render(helloView)
```

### view.state

`view.state` is how you access the state for any view. You can mutate it and then call `render(view)` afterwards to see the dom update.

### render(view)

This function just re-renders the dom whenever you call it, using the state within the view. Require it with `require('vvvview/render')`.

## patterns

Works well with FRP

```js
myView = createView(document.body, rootComponent)
function updateView(val) {
	myView.state.x = val
	render(myView)
}
Kefir.sequentially(100, [1,2,3]).onValue(updateView)
```

### todo

* event handling
* ajax sync functionality
* easy way to be pure-fp?

#### ideas

* build in FRP for state change? (ie Kefir). The state for each view could be a Property that re-renders onValue. Just take other streams (eg event streams), and combine them into the state's single property stream.

