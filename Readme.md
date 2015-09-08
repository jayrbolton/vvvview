# vvvview

A minimalist module that allows you to easily combine usage of virtual dom (using [virtual-dom](https://github.com/Matt-Esch/virtual-dom)) with functional reactive programming (using [flyd](https://github.com/paldepind/flyd)).

Goals:
- view state is effectively immutable.
- easily compose many streams into a single state that gets automatically re-rendered on all changes.
- easily thunk (ie partial) out branches of your VTree for efficient re-rendering.
- light dependencies.
- modify the state with plain js.

We abstract away any state mutation by using the `combineState` function, which takes a stream and a view and combines that stream into the view's state. All updates to the view's state, and thus to the dom, are purely functional and easily testable. You can think of a view as a bunch of asynchronous streams that all get combined into a single state stream that renders into the DOM on every update.

See the [todo example](examples/todo/index.js)

### installing and requiring

Install with `npm` and import any modules you need:

```js
import {partial, combineState, createView, h, flyd} from 'vvvview'
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
let vCount = view.create(document.body, hHello, {msg: 'hi'})
```

### combineState(combinatorFunction, viewInstance, [arrayOfStreams])

When you have a stream that you want to use to update the DOM, you can use the `combine` function to combine it into the view's state stream:

```js
// Continuing the counter example above, we now have a 'clicks' stream we can use to count your clicks
let counts = flyd.scan(total => total+1, 0, clicks)

combineState((state, n) => {
	// inside the combinator function, we can change the state and return the new state based on the count.
	state.count = n
	return state
}, vCount, [counts])
```

### partial(fn, ...args)

In your component functions, use the partial function to prevent rerendering child components when data has not changed:

```js
const root = state => h('p', partial(childComponent, state.val))
const childComponent = val => h('span', 'val: ' + val)

view = createView(document.body, root, {val: 11}) // Initially, both root and childComponent get rendered
let s = flyd.stream()
combineState(state => {
	state.xyz = 123
	return state // state.val is not affected
}, view, [s])

// On any value in the 's' stream, the view will get re-rendered, but childComponent will not get run again since state.val has not changed.
s(333)
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

