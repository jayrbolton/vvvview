# vvvview

This is just a convenience wrapper around virtual-dom boilerplate that we use for front-end rendering at [CommitChange](https://github.com/commitchange/)

### view(rootNode, rootComponent, options)

Construct a new view instance. Pass in:

* rootNode: the node that you want to append your virtual-dom into (eg document.body)
* rootComponent: a function that takes some state and return a vdom.
* options:
** defaultState: this can be a default javascript object for your initial state
** cacheState: if you want to cache the whole state to localStorage automatically, pass in a key name for this option (eg 'appView')

Example:

```js
var view = require('vvvview')
var h = require('virtual-dom/h')

function hello(msg) {
	return el('p', msg)
}

helloView = view(document.body, hello, {defaultState: 'hallo welt!'})
```

### view.state

`view.state` is how you access the state for your view. You can mutate it and then call `view.render()` afterwards to see the dom update.

### view.render()

This function just re-renders the dom whenever you call it

## patterns

Works well with FRP

```js
myView = view(document.body, rootComponent)
function updateView(val) {
	myView.state.x = val
	myView.render()
}
Kefir.sequentially(100, [1,2,3]).onValue(updateView)
```

