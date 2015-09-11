# vvvview

A minimalist module that allows you to easily combine usage of virtual dom (using [virtual-dom](https://github.com/Matt-Esch/virtual-dom)) with functional reactive programming (using [flyd](https://github.com/paldepind/flyd)).

Goals:
- view state is effectively immutable.
- easily compose many streams into a single state that gets automatically re-rendered on all changes.
- light dependencies.
- modify the state with plain js.

We abstract away any state mutation by using the `combineState` function, which takes a stream and a view and combines that stream into the view's state. All updates to the view's state, and thus to the dom, are purely functional and easily testable. You can think of a view as a bunch of asynchronous streams that all get combined into a single state stream that renders into the DOM on every update.

See the [todo example](examples/todo/index.js)

### installing and requiring

Install with `npm` and import any modules you need:

```js
import {combineState, createView, h, flyd} from 'vvvview'
```

### createView(rootNode, rootComponent, initialState)

Construct a new view object. Pass in:

* rootNode: the node where you want to mount your virtual-dom (eg document.body)
* rootComponent: a function that takes some state and returns a vdom.
* initialState: an object that represents your view's initial state

Example:

```js
const clicks = flyd.stream()
const hCount = state => h('a', {onclick: clicks}, state.count || 'click me!')
let vCount = view.create(document.body, hCount, {count: 0})
```

### combineState(combinatorFunction, viewInstance, [arrayOfStreams])

When you have a stream that you want to use to update the DOM, you can use the `combineState` function to combine stream values into the view's state and re-render:

```js
// Continuing the counter example above, we now have a 'clicks' stream we can use to count your clicks
let counts = flyd.scan(total => total+1, 0, clicks)

combineState((state, n) => {
	// inside, we can change the state and return the new state based on the count.
	state.count = n
	return state
}, vCount, [counts])
```

### view.sync

`view.sync` is just a simple, side-effecty way to do something on every re-render given the view's state:

```js
view.sync = function(state) {
	localStorage.setItem('view.state', JSON.stringify(view.state))
}
```

### todo

* some unit tests 
* think about immutable libs. Are there any non-giant immutable libs?

