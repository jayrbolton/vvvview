# vvvview

A very light module that allows you to easily combine usage of virtual dom trees (using [virtual-dom](https://github.com/Matt-Esch/virtual-dom)) with functional reactive programming (using [flyd](https://github.com/paldepind/flyd))

Goals:
- easily compose many streams of asynchronous data into a single state that gets automatically re-rendered.
- modular virtual dom components that depend only on the arguments passed into them, able to be mixed and used in any context with different behavior.
- clean event handling

We abstract away any state mutation by using the `combine` function, which takes a stream and a view and combines that stream into the view's state. All updates to the view's state, and thus to the dom, are purely functional and easily testable. You can think of a view as a bunch of asynchronous streams that all get combined into a single state stream that renders into the DOM on every update.

Usually you will need only one view for your app. If you have multiple areas of your app that never need to share any data, then separate those into different views. That is, the division between views is defined by non-interdependency of any data.

See the [todo example](examples/todo/index.js)

### view.create(rootNode, rootComponent, initialState)

Construct a new view instance. Pass in:

* rootNode: the node where you want to mount your virtual-dom (eg document.body)
* rootComponent: a function that takes some state and returns a vdom.
* initialState: an object that represents your view's initial state

Example:

```js
var view = require('vvvview')
var h = require('virtual-dom/h')

function hHello(msg) {
	return h('p', msg)
}

var hello = view.create(document.body, hHello, {msg: 'hi'})
```

### view.evStream(viewInstance, name)

Retrieve an existing event stream from within your view. Event streams can be referenced from within your virtual dom tree as the values for events like `onclick`, `onsubmit`, etc.

```js
function hCounter(state, stream) {
	return h('a', {onclick: stream('count')}, state.count || 'click me!')
}

var counter = view.create(document.body, hCounter, {count: 0})

// Retrieve the 'count' event stream and reduce it into a total count value
var totalCount = flyd.scan(function(n) {return n + 1}, 0, view.evStream(counter, 'count'))
```

### view.combine(viewInstance, stream, combinatorFunction)

When you have a stream that you want to use to update the DOM, you can use the `combine` function to combine it into the view's state stream:

```js
// Continuing the counter example above, we now have a 'totalCount' stream that sums your total clicks
view.combine(counter, totalCount, function(state, n) {
	// inside the combinator function, we can change the state and return the new state based on the count.
	state.count = n
	return state
})
```

### view.sync

`view.sync` is just a simple, side-effecty way to to something on every re-render given the view's state:

```js
view.sync = function(state) {
	localStorage.setItem('view.state', JSON.stringify(view.state))
}
```

For convience sake, you can access both `virtual-dom/h` using `vvvview.h` and `flyd` using `vvvview.flyd`.

### todo

* some unit tests 
* immutable view state w/ history

